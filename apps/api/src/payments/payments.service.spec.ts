import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { PaymentStatus } from '@prisma/client';

import { ORDER_ERRORS, PAYMENT_ERRORS } from '../common/constants/errors';

import { PaymentsRepository } from './payments.repository';
import { PaymentsService } from './payments.service';

import type { TestingModule } from '@nestjs/testing';

const TOSS_CONFIRM_URL = 'https://api.tosspayments.com/v1/payments/confirm';
const TOSS_IDEMPOTENCY_KEY_HEADER = 'Idempotency-Key';
const ORDER_ID = 'order-1';
const USER_ID = 'user-1';
const PAYMENT_KEY = 'toss_key';
const PAYMENT_AMOUNT = 50_000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

describe('PaymentsService - confirmPayment', () => {
  let service: PaymentsService;
  let fetchSpy: jest.SpyInstance<
    Promise<Response>,
    Parameters<typeof globalThis.fetch>
  >;

  const mockPaymentsRepository = {
    findOrderPayment: jest.fn(),
    findOrderPaymentOnly: jest.fn(),
    updatePaymentStatus: jest.fn(),
  };

  const mockConfigService = {
    getOrThrow: jest.fn((key: string) => {
      if (key === 'TOSS_CLIENT_KEY') {
        return '';
      }
      return '';
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: PaymentsRepository, useValue: mockPaymentsRepository },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);

    jest.clearAllMocks();
    fetchSpy = jest
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue({} as Response);
  });

  it('토스 승인이 성공하면 DB를 업데이트하고 성공 데이터를 반환한다', async () => {
    const mockOrder = {
      id: ORDER_ID,
      clientUserId: USER_ID,
      totalAmount: PAYMENT_AMOUNT,
      payment: {
        id: 'payment-1',
        status: PaymentStatus.PENDING,
        paidAmount: PAYMENT_AMOUNT,
        refund: null,
      },
    };

    mockPaymentsRepository.findOrderPayment.mockResolvedValueOnce(mockOrder);
    mockPaymentsRepository.updatePaymentStatus.mockResolvedValueOnce({
      count: 1,
    });
    mockPaymentsRepository.findOrderPaymentOnly.mockResolvedValueOnce({
      ...mockOrder,
      payment: {
        ...mockOrder.payment,
        status: PaymentStatus.PAID,
        paymentKey: PAYMENT_KEY,
        refund: null,
      },
    });

    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          approvedAt: '2026-06-02T19:20:00+09:00',
          method: 'CARD',
          card: { installmentPlanMonths: 0 },
        }),
    } as Response);

    const result = await service.confirmPayment(
      USER_ID,
      ORDER_ID,
      PAYMENT_KEY,
      PAYMENT_AMOUNT,
    );

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const firstCall = fetchSpy.mock.calls[0];
    if (!firstCall) {
      throw new Error('fetch 호출이 없습니다.');
    }
    const [url, init] = firstCall;
    expect(url).toBe(TOSS_CONFIRM_URL);
    const headers: unknown = init?.headers;
    if (!isRecord(headers)) {
      throw new Error('headers가 객체가 아닙니다.');
    }
    expect(headers[TOSS_IDEMPOTENCY_KEY_HEADER]).toBe(ORDER_ID);
    expect(result.status).toBe(PaymentStatus.PAID);

    expect(mockPaymentsRepository.updatePaymentStatus).toHaveBeenCalledTimes(1);
    const [, updateData] = mockPaymentsRepository.updatePaymentStatus.mock
      .calls[0] as [
      string,
      {
        approvedAt: Date;
        rawData: unknown;
        paidAmount: number;
        paymentKey: string;
        method: string;
        installmentMonths: number;
      },
    ];
    expect(updateData.paymentKey).toBe(PAYMENT_KEY);
    expect(updateData.paidAmount).toBe(PAYMENT_AMOUNT);
    expect(updateData.approvedAt).toBeInstanceOf(Date);
    expect(updateData.method).toBe('CARD');
    expect(updateData.installmentMonths).toBe(1);
    expect(updateData.rawData).toEqual(
      expect.objectContaining({
        approvedAt: '2026-06-02T19:20:00+09:00',
        method: 'CARD',
      }),
    );
  });

  it('토스 서버가 409 중복 요청 에러를 반환하면 ALREADY_CONFIRMED 예외를 던진다', async () => {
    const mockOrder = {
      id: ORDER_ID,
      clientUserId: USER_ID,
      totalAmount: PAYMENT_AMOUNT,
      payment: {
        id: 'payment-1',
        status: PaymentStatus.PENDING,
        paidAmount: PAYMENT_AMOUNT,
        refund: null,
      },
    };
    mockPaymentsRepository.findOrderPayment.mockResolvedValueOnce(mockOrder);

    fetchSpy.mockResolvedValueOnce({
      ok: false,
      status: 409,
      json: () =>
        Promise.resolve({
          code: 'IDEMPOTENT_REQUEST_PROCESSING',
          message: '이미 처리 중인 요청입니다.',
        }),
    } as Response);

    await expect(
      service.confirmPayment(USER_ID, ORDER_ID, PAYMENT_KEY, PAYMENT_AMOUNT),
    ).rejects.toMatchObject({
      message: PAYMENT_ERRORS.ALREADY_CONFIRMED.message,
    });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(mockPaymentsRepository.updatePaymentStatus).not.toHaveBeenCalled();
  });
});

describe('PaymentsService - preparePayment', () => {
  let service: PaymentsService;

  const mockPaymentsRepository = {
    findOrderForPrepare: jest.fn(),
  };

  const mockConfigService = {
    getOrThrow: jest.fn((key: string) => {
      if (key === 'TOSS_CLIENT_KEY') {
        return 'test_client_key_1234567890';
      }
      return 'test_secret_key_1234567890';
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: PaymentsRepository, useValue: mockPaymentsRepository },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    jest.clearAllMocks();
  });

  const pendingOrder = {
    id: ORDER_ID,
    clientUserId: USER_ID,
    totalAmount: PAYMENT_AMOUNT,
    service: { title: '코칭 서비스' },
    payment: {
      id: 'payment-1',
      status: PaymentStatus.PENDING,
      method: 'CARD',
      installmentMonths: 1,
    },
  };

  it('PENDING 주문이면 위젯 파라미터를 반환한다', async () => {
    mockPaymentsRepository.findOrderForPrepare.mockResolvedValueOnce(
      pendingOrder,
    );

    const result = await service.preparePayment(USER_ID, ORDER_ID, {
      orderName: '커스텀 주문명',
      installmentMonths: 3,
    });

    expect(result).toEqual({
      orderId: ORDER_ID,
      amount: PAYMENT_AMOUNT,
      orderName: '커스텀 주문명',
      clientKey: 'test_client_key_1234567890',
      customerKey: USER_ID,
      paymentId: 'payment-1',
      method: 'CARD',
      installmentMonths: 3,
    });
  });

  it('orderName 미전달 시 서비스 타이틀로 fallback한다', async () => {
    mockPaymentsRepository.findOrderForPrepare.mockResolvedValueOnce(
      pendingOrder,
    );

    const result = await service.preparePayment(USER_ID, ORDER_ID);

    expect(result.orderName).toBe('코칭 서비스');
  });

  it('주문이 없으면 ORDER_ERRORS.NOT_FOUND 예외를 던진다', async () => {
    mockPaymentsRepository.findOrderForPrepare.mockResolvedValueOnce(null);

    await expect(
      service.preparePayment(USER_ID, ORDER_ID),
    ).rejects.toMatchObject({
      message: ORDER_ERRORS.NOT_FOUND.message,
    });
  });

  it('주문 소유자가 아니면 ORDER_ERRORS.FORBIDDEN_NOT_OWNER 예외를 던진다', async () => {
    mockPaymentsRepository.findOrderForPrepare.mockResolvedValueOnce({
      ...pendingOrder,
      clientUserId: 'other-user',
    });

    await expect(
      service.preparePayment(USER_ID, ORDER_ID),
    ).rejects.toMatchObject({
      message: ORDER_ERRORS.FORBIDDEN_NOT_OWNER.message,
    });
  });

  it('결제 행이 없으면 PAYMENT_ERRORS.NOT_FOUND 예외를 던진다', async () => {
    mockPaymentsRepository.findOrderForPrepare.mockResolvedValueOnce({
      ...pendingOrder,
      payment: null,
    });

    await expect(
      service.preparePayment(USER_ID, ORDER_ID),
    ).rejects.toMatchObject({
      message: PAYMENT_ERRORS.NOT_FOUND.message,
    });
  });

  it('이미 PAID 상태이면 PAYMENT_ERRORS.ALREADY_CONFIRMED 예외를 던진다', async () => {
    mockPaymentsRepository.findOrderForPrepare.mockResolvedValueOnce({
      ...pendingOrder,
      payment: { ...pendingOrder.payment, status: PaymentStatus.PAID },
    });

    await expect(
      service.preparePayment(USER_ID, ORDER_ID),
    ).rejects.toMatchObject({
      message: PAYMENT_ERRORS.ALREADY_CONFIRMED.message,
    });
  });
});
