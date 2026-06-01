import { Injectable } from '@nestjs/common';

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
}
