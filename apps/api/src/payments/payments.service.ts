import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentStatus } from '@prisma/client';

import {
  COMMON_ERRORS,
  ORDER_ERRORS,
  PAYMENT_ERRORS,
} from '../common/constants/errors';
import { AppException } from '../common/exceptions/app.exception';

import { mapOrderPayment } from './payments.mapper';
import { PaymentsRepository } from './payments.repository';

interface TossConfirmSuccessResponse {
  approvedAt?: string;
}

interface TossConfirmErrorResponse {
  code: string;
  message: string;
}

type TossConfirmResponse =
  | TossConfirmSuccessResponse
  | TossConfirmErrorResponse;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

@Injectable()
export class PaymentsService {
  private readonly tossBasicToken: string;

  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    config: ConfigService,
  ) {
    this.tossBasicToken = Buffer.from(
      `${config.getOrThrow<string>('TOSS_SECRET_KEY')}:`,
    ).toString('base64');
  }

  async getOrderPayment(userId: string, orderId: string) {
    const order = await this.paymentsRepository.findOrderPayment(orderId);
    if (!order) throw new AppException(ORDER_ERRORS.NOT_FOUND);

    if (order.clientUserId !== userId && order.expertUserId !== userId) {
      throw new AppException(ORDER_ERRORS.FORBIDDEN_NOT_OWNER);
    }

    if (order.payment === null) {
      throw new AppException(PAYMENT_ERRORS.NOT_FOUND);
    }

    const { payment } = order;
    return mapOrderPayment(payment);
  }

  async confirmPayment(
    userId: string,
    orderId: string,
    paymentKey: string,
    amount: number,
  ) {
    const order = await this.paymentsRepository.findOrderPayment(orderId);
    if (!order) throw new AppException(ORDER_ERRORS.NOT_FOUND);

    if (order.clientUserId !== userId) {
      throw new AppException(ORDER_ERRORS.FORBIDDEN_NOT_OWNER);
    }

    if (!order.payment) {
      throw new AppException(PAYMENT_ERRORS.NOT_FOUND);
    }

    if (order.totalAmount !== amount) {
      throw new AppException(PAYMENT_ERRORS.AMOUNT_MISMATCH);
    }

    if (order.payment.status !== PaymentStatus.PENDING) {
      throw new AppException(PAYMENT_ERRORS.ALREADY_CONFIRMED);
    }

    const approvedAt = await this.#confirmWithToss(paymentKey, orderId, amount);

    const { count } = await this.paymentsRepository.updatePaymentStatus(
      order.payment.id,
      { paymentKey, paidAmount: amount, approvedAt },
    );

    if (count === 0) {
      throw new AppException(PAYMENT_ERRORS.ALREADY_CONFIRMED);
    }

    const updated = await this.paymentsRepository.findOrderPayment(orderId);
    if (!updated?.payment) {
      throw new AppException(PAYMENT_ERRORS.NOT_FOUND);
    }

    return mapOrderPayment(updated.payment);
  }

  async #confirmWithToss(
    paymentKey: string,
    orderId: string,
    amount: number,
  ): Promise<Date> {
    let response: Response;

    try {
      response = await fetch(
        'https://api.tosspayments.com/v1/payments/confirm',
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${this.tossBasicToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ paymentKey, orderId, amount }),
        },
      );
    } catch {
      throw new AppException(COMMON_ERRORS.INTERNAL_SERVER_ERROR);
    }

    const data: unknown = await response.json();
    const tossData: TossConfirmResponse = isRecord(data)
      ? data
      : { code: 'UNKNOWN', message: 'UNKNOWN' };

    if (!response.ok) {
      throw new AppException(PAYMENT_ERRORS.FAILED);
    }

    const approvedAt =
      'approvedAt' in tossData && typeof tossData.approvedAt === 'string'
        ? new Date(tossData.approvedAt)
        : new Date();

    if (Number.isNaN(approvedAt.getTime())) {
      return new Date();
    }

    return approvedAt;
  }
}
