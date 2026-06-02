import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { PaymentStatus } from '@prisma/client';

import { AppException } from '../common/exceptions/app.exception';

import { PaymentsRepository } from './payments.repository';
import { PaymentsService } from './payments.service';

import type { TestingModule } from '@nestjs/testing';

describe('PaymentsService - confirmPayment', () => {
  let service: PaymentsService;

  const mockPaymentsRepository = {
    findOrderPayment: jest.fn(),
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

    jest.spyOn(globalThis, 'fetch').mockReset();
  });

  it('토스 승인이 성공하면 DB를 업데이트하고 성공 데이터를 반환한다', async () => {
    const mockOrder = {
      id: 'order-1',
      clientUserId: 'user-1',
      totalAmount: 50_000,
      payment: {
        id: 'payment-1',
        status: PaymentStatus.PENDING,
        paidAmount: 50_000,
        refund: null,
      },
    };

    mockPaymentsRepository.findOrderPayment.mockResolvedValueOnce(mockOrder);
    mockPaymentsRepository.updatePaymentStatus.mockResolvedValueOnce({
      count: 1,
    });
    mockPaymentsRepository.findOrderPayment.mockResolvedValueOnce({
      ...mockOrder,
      payment: {
        ...mockOrder.payment,
        status: PaymentStatus.PAID,
        paymentKey: 'toss_key',
        refund: null,
      },
    });

    jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ approvedAt: '2026-06-02T19:20:00+09:00' }),
    } as Response);

    const result = await service.confirmPayment(
      'user-1',
      'order-1',
      'toss_key',
      50_000,
    );

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    expect(result.status).toBe(PaymentStatus.PAID);
  });

  it('토스 응답이 비정상적인 객체거나 문자열이어도 isRecord가 FAILED 예외를 던진다', async () => {
    const mockOrder = {
      id: 'order-1',
      clientUserId: 'user-1',
      totalAmount: 50_000,
      payment: {
        id: 'payment-1',
        status: PaymentStatus.PENDING,
        paidAmount: 50_000,
      },
    };
    mockPaymentsRepository.findOrderPayment.mockResolvedValueOnce(mockOrder);

    jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve('Internal Server Error'),
    } as Response);

    await expect(
      service.confirmPayment('user-1', 'order-1', 'toss_key', 50_000),
    ).rejects.toThrow(AppException);
  });
});
