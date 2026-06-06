import { Injectable } from '@nestjs/common';

import { ORDER_ERRORS } from '../../common/constants/errors';
import { AppException } from '../../common/exceptions/app.exception';

import { AdminOrderRepository } from './admin-order.repository';

import type { OrderTransactionResponseDto } from './dto/order-transaction-response.dto';

@Injectable()
export class AdminOrderService {
  constructor(private readonly adminOrderRepository: AdminOrderRepository) {}

  async getOrderTransaction(
    orderId: string,
  ): Promise<OrderTransactionResponseDto> {
    const order =
      await this.adminOrderRepository.findOrderTransactionById(orderId);
    if (!order?.payment?.approvedAt) {
      throw new AppException(ORDER_ERRORS.NOT_FOUND);
    }

    return {
      paidAt: order.payment.approvedAt,
      method: order.payment.method,
      installmentMonths: order.payment.installmentMonths,
      servicePrice: order.agreedServicePrice,
      platformFee: order.platformFee,
      totalAmount: order.totalAmount,
    };
  }
}
