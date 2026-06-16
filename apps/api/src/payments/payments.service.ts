import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ORDER_ERRORS, PAYMENT_ERRORS } from '../common/constants/errors';
import { AppException } from '../common/exceptions/app.exception';
import { isRecord } from '../common/utils/is-record.util';
import { DEFAULT_PAYMENT_METHOD } from '../orders/orders.constants';

import {
  mapOrderPaymentForClient,
  mapOrderPaymentForExpert,
} from './payments.mapper';
import { PaymentsRepository } from './payments.repository';

import type { Prisma } from '@prisma/client';

const TOSS_CONFIRM_URL = 'https://api.tosspayments.com/v1/payments/confirm';
const TOSS_CANCEL_URL = 'https://api.tosspayments.com/v1/payments';
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

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
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

    const isClient = order.clientUserId === userId;
    const isExpert = order.expertUserId === userId;

    if (!isClient && !isExpert) {
      throw new AppException(ORDER_ERRORS.FORBIDDEN_NOT_OWNER);
    }

    if (order.payment === null) {
      throw new AppException(PAYMENT_ERRORS.NOT_FOUND);
    }

    const orderWithPayment = { ...order, payment: order.payment };

    return isClient
      ? mapOrderPaymentForClient(orderWithPayment)
      : mapOrderPaymentForExpert(orderWithPayment);
  }

  async confirmTossPayment(
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
          [TOSS_IDEMPOTENCY_KEY_HEADER]: paymentKey,
        },
        body: JSON.stringify({ paymentKey, orderId, amount }),
        signal: controller.signal,
      });
    } catch (error) {
      this.logger.error(
        `Toss 결제 승인 요청 실패 (네트워크/타임아웃). orderId=${orderId}, paymentKey=${paymentKey}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw new AppException(PAYMENT_ERRORS.FAILED);
    } finally {
      clearTimeout(timeoutId);
    }

    let data: unknown;
    try {
      data = await response.json();
    } catch (error) {
      this.logger.error(
        `Toss 응답 JSON 파싱 실패. orderId=${orderId}, paymentKey=${paymentKey}, status=${response.status}`,
        error instanceof Error ? error.stack : String(error),
      );
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
      this.logger.warn(
        `Toss 결제 승인 거절. orderId=${orderId}, paymentKey=${paymentKey}, status=${response.status}, response=${JSON.stringify(tossData)}`,
      );
      throw new AppException(PAYMENT_ERRORS.FAILED);
    }

    if (
      !('approvedAt' in tossData) ||
      typeof tossData.approvedAt !== 'string'
    ) {
      this.logger.error(
        `Toss 응답에 approvedAt 누락. orderId=${orderId}, paymentKey=${paymentKey}, response=${JSON.stringify(tossData)}`,
      );
      throw new AppException(PAYMENT_ERRORS.FAILED);
    }

    const approvedAt = new Date(tossData.approvedAt);
    if (Number.isNaN(approvedAt.getTime())) {
      this.logger.error(
        `Toss 응답의 approvedAt 파싱 실패. orderId=${orderId}, paymentKey=${paymentKey}, value=${tossData.approvedAt}`,
      );
      throw new AppException(PAYMENT_ERRORS.FAILED);
    }

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
      approvedAt,
      method,
      installmentMonths,
      rawData: tossData as Prisma.InputJsonValue,
    };
  }

  async cancelTossPayment(
    paymentKey: string,
    cancelReason: string,
    cancelAmount: number,
  ): Promise<{ canceledAt: Date; rawData: Prisma.InputJsonValue }> {
    let response: Response;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, TOSS_CONFIRM_TIMEOUT_MS);

    try {
      response = await fetch(`${TOSS_CANCEL_URL}/${paymentKey}/cancel`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${this.tossBasicToken}`,
          'Content-Type': 'application/json',
          [TOSS_IDEMPOTENCY_KEY_HEADER]: `cancel_${paymentKey}`,
        },
        body: JSON.stringify({ cancelReason, cancelAmount }),
        signal: controller.signal,
      });
    } catch (error) {
      this.logger.error(
        `Toss 결제 취소 요청 실패 (네트워크/타임아웃). paymentKey=${paymentKey}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw new AppException(PAYMENT_ERRORS.CANCEL_FAILED);
    } finally {
      clearTimeout(timeoutId);
    }

    let data: unknown;
    try {
      data = await response.json();
    } catch (error) {
      this.logger.error(
        `Toss 취소 응답 JSON 파싱 실패. paymentKey=${paymentKey}, status=${response.status}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw new AppException(PAYMENT_ERRORS.CANCEL_FAILED);
    }

    const tossData = isRecord(data)
      ? data
      : { code: 'UNKNOWN', message: 'UNKNOWN' };

    if (!response.ok) {
      if (
        response.status === 409 &&
        'code' in tossData &&
        tossData.code === TOSS_IDEMPOTENT_REQUEST_PROCESSING_CODE
      ) {
        throw new AppException(ORDER_ERRORS.ALREADY_PROCESSED);
      }
      this.logger.warn(
        `Toss 결제 취소 거절. paymentKey=${paymentKey}, status=${response.status}, response=${JSON.stringify(tossData)}`,
      );
      throw new AppException(PAYMENT_ERRORS.CANCEL_FAILED);
    }

    const rawCancels =
      'cancels' in tossData && Array.isArray(tossData.cancels)
        ? tossData.cancels
        : undefined;
    const firstCancel =
      rawCancels !== undefined && isRecord(rawCancels[0])
        ? rawCancels[0]
        : undefined;
    const canceledAtRaw =
      isRecord(firstCancel) && typeof firstCancel.canceledAt === 'string'
        ? firstCancel.canceledAt
        : undefined;

    if (!canceledAtRaw) {
      this.logger.error(
        `Toss 취소 응답에 canceledAt 누락. paymentKey=${paymentKey}, response=${JSON.stringify(tossData)}`,
      );
      throw new AppException(PAYMENT_ERRORS.CANCEL_FAILED);
    }

    const canceledAt = new Date(canceledAtRaw);
    if (Number.isNaN(canceledAt.getTime())) {
      this.logger.error(
        `Toss 취소 응답 canceledAt 파싱 실패. paymentKey=${paymentKey}, value=${canceledAtRaw}`,
      );
      throw new AppException(PAYMENT_ERRORS.CANCEL_FAILED);
    }

    return { canceledAt, rawData: tossData as Prisma.InputJsonValue };
  }
}
