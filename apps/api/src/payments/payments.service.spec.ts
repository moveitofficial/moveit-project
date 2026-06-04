import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { PaymentStatus } from '@prisma/client';

import { AppException } from '../common/exceptions/app.exception';

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
    getOrThrow: jest.fn().mockReturnValue('test_secret_key_1234567890'),
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
    ).rejects.toThrow(AppException);
  });
});
