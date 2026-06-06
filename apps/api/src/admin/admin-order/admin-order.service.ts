import { Injectable } from '@nestjs/common';

import { ORDER_ERRORS } from '../../common/constants/errors';
import { AppException } from '../../common/exceptions/app.exception';

import { AdminOrderRepository } from './admin-order.repository';

import type { OrderRefundResponseDto } from './dto/order-refund-response.dto';
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

  async getOrderRefund(orderId: string): Promise<OrderRefundResponseDto> {
    const order = await this.adminOrderRepository.findOrderRefundById(orderId);
    if (!order?.payment?.approvedAt || !order.payment.refund?.approvedAt) {
      throw new AppException(ORDER_ERRORS.NOT_FOUND);
    }

    const refund = order.payment.refund;

    const approvedBy = refund.approvedAdmin
      ? {
          type: 'ADMIN' as const,
          name: refund.approvedAdmin.name,
          reason: refund.adminReason,
        }
      : {
          type: 'EXPERT' as const,
          name: refund.expertUser.name,
          reason: null,
        };

    return {
      paidAt: order.payment.approvedAt,
      method: order.payment.method,
      installmentMonths: order.payment.installmentMonths,
      servicePrice: order.agreedServicePrice,
      refundAmount: refund.refundAmount,
      type: refund.type,
      approvedAt: order.payment.refund.approvedAt,
      approvedBy,
    };
  }
}
