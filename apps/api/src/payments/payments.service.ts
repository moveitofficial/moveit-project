import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentStatus } from '@prisma/client';

import {
  COMMON_ERRORS,
  ORDER_ERRORS,
  PAYMENT_ERRORS,
} from '../common/constants/errors';
import { AppException } from '../common/exceptions/app.exception';
import { DEFAULT_PAYMENT_METHOD } from '../orders/orders.constants';

import { mapOrderPayment } from './payments.mapper';
import { PaymentsRepository } from './payments.repository';

import type { Prisma } from '@prisma/client';

const TOSS_CONFIRM_URL = 'https://api.tosspayments.com/v1/payments/confirm';
const TOSS_CONFIRM_TIMEOUT_MS = 30_000;
const TOSS_IDEMPOTENCY_KEY_HEADER = 'Idempotency-Key';
const TOSS_IDEMPOTENT_REQUEST_PROCESSING_CODE = 'IDEMPOTENT_REQUEST_PROCESSING';

interface TossConfirmSuccessResponse {
  approvedAt?: string;
  method?: string;
  card?: { installmentPlanMonths?: number };
  [key: string]: unknown;
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
  private readonly tossClientKey: string;

  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    config: ConfigService,
  ) {
    this.tossBasicToken = Buffer.from(
      `${config.getOrThrow<string>('TOSS_SECRET_KEY')}:`,
    ).toString('base64');
    this.tossClientKey = config.getOrThrow<string>('TOSS_CLIENT_KEY');
  }

  async preparePayment(
    userId: string,
    orderId: string,
    options?: {
      orderName?: string;
      method?: string;
      installmentMonths?: number;
    },
  ) {
    const order = await this.paymentsRepository.findOrderForPrepare(orderId);
    if (!order) throw new AppException(ORDER_ERRORS.NOT_FOUND);

    if (order.clientUserId !== userId) {
      throw new AppException(ORDER_ERRORS.FORBIDDEN_NOT_OWNER);
    }

    if (!order.payment) {
      throw new AppException(PAYMENT_ERRORS.NOT_FOUND);
    }

    if (order.payment.status !== PaymentStatus.PENDING) {
      throw new AppException(PAYMENT_ERRORS.ALREADY_CONFIRMED);
    }

    return {
      orderId: order.id,
      amount: order.totalAmount,
      orderName: options?.orderName ?? order.service.title,
      clientKey: this.tossClientKey,
      customerKey: userId,
      paymentId: order.payment.id,
      method: options?.method ?? order.payment.method,
      installmentMonths:
        options?.installmentMonths ?? order.payment.installmentMonths,
    };
  }

  async getOrderPayment(userId: string, orderId: string) {
    const order = await this.paymentsRepository.findOrderPaymentOnly(orderId);
    if (!order) throw new AppException(ORDER_ERRORS.NOT_FOUND);

    if (order.clientUserId !== userId && order.expertUserId !== userId) {
      throw new AppException(ORDER_ERRORS.FORBIDDEN_NOT_OWNER);
    }

    if (order.payment === null) {
      throw new AppException(PAYMENT_ERRORS.NOT_FOUND);
    }

    return mapOrderPayment(order.payment);
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

    const { approvedAt, method, installmentMonths, rawData } =
      await this.#confirmWithToss(paymentKey, orderId, amount);

    const { count } = await this.paymentsRepository.updatePaymentStatus(
      order.payment.id,
      {
        paymentKey,
        paidAmount: amount,
        approvedAt,
        method,
        installmentMonths,
        rawData,
      },
    );

    if (count === 0) {
      throw new AppException(PAYMENT_ERRORS.ALREADY_CONFIRMED);
    }

    const updated = await this.paymentsRepository.findOrderPaymentOnly(orderId);
    if (!updated?.payment) {
      throw new AppException(PAYMENT_ERRORS.NOT_FOUND);
    }

    return mapOrderPayment(updated.payment);
  }

  async #confirmWithToss(
    paymentKey: string,
    orderId: string,
    amount: number,
  ): Promise<{
    approvedAt: Date;
    method: string;
    installmentMonths: number;
    rawData: Prisma.InputJsonValue;
  }> {
    let response: Response;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, TOSS_CONFIRM_TIMEOUT_MS);

    try {
      response = await fetch(TOSS_CONFIRM_URL, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${this.tossBasicToken}`,
          'Content-Type': 'application/json',
          [TOSS_IDEMPOTENCY_KEY_HEADER]: orderId,
        },
        body: JSON.stringify({ paymentKey, orderId, amount }),
        signal: controller.signal,
      });
    } catch {
      throw new AppException(COMMON_ERRORS.INTERNAL_SERVER_ERROR);
    } finally {
      clearTimeout(timeoutId);
    }

    let data: unknown;
    try {
      data = await response.json();
    } catch {
      throw new AppException(PAYMENT_ERRORS.FAILED);
    }

    const tossData: TossConfirmResponse = isRecord(data)
      ? data
      : { code: 'UNKNOWN', message: 'UNKNOWN' };

    if (!response.ok) {
      if (
        response.status === 409 &&
        'code' in tossData &&
        tossData.code === TOSS_IDEMPOTENT_REQUEST_PROCESSING_CODE
      ) {
        throw new AppException(PAYMENT_ERRORS.ALREADY_CONFIRMED);
      }
      throw new AppException(PAYMENT_ERRORS.FAILED);
    }

    const approvedAt =
      'approvedAt' in tossData && typeof tossData.approvedAt === 'string'
        ? new Date(tossData.approvedAt)
        : new Date();

    const finalApprovedAt = Number.isNaN(approvedAt.getTime())
      ? new Date()
      : approvedAt;

    const method =
      'method' in tossData && typeof tossData.method === 'string'
        ? tossData.method
        : DEFAULT_PAYMENT_METHOD;

    // Toss 일시불 시 0 반환 → 스키마 컨벤션(1=일시불)으로 변환
    const rawInstallmentMonths =
      'card' in tossData && isRecord(tossData.card)
        ? tossData.card.installmentPlanMonths
        : undefined;

    const installmentMonths =
      typeof rawInstallmentMonths === 'number' && rawInstallmentMonths > 0
        ? rawInstallmentMonths
        : 1;

    return {
      approvedAt: finalApprovedAt,
      method,
      installmentMonths,
      rawData: tossData as unknown as Prisma.InputJsonValue,
    };
  }
}
