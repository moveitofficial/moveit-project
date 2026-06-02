import { Injectable } from '@nestjs/common';
import { PaymentStatus } from '@prisma/client';

import { ORDER_ERRORS, PAYMENT_ERRORS } from '../common/constants/errors';
import { AppException } from '../common/exceptions/app.exception';

import { mapOrderPayment } from './payments.mapper';
import { PaymentsRepository } from './payments.repository';

@Injectable()
export class PaymentsService {
  constructor(private readonly paymentsRepository: PaymentsRepository) {}

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

    const { count } = await this.paymentsRepository.updatePaymentStatus(
      order.payment.id,
      { paymentKey, paidAmount: amount, approvedAt: new Date() },
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
}
