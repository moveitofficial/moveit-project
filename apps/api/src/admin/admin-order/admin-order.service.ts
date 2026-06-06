import { Injectable } from '@nestjs/common';
import { NotificationCategory } from '@prisma/client';

import { ORDER_ERRORS } from '../../common/constants/errors';
import { AppException } from '../../common/exceptions/app.exception';
import { NotificationsService } from '../../notifications/notifications.service';

import { AdminOrderRepository } from './admin-order.repository';

import type { OrderRefundResponseDto } from './dto/order-refund-response.dto';
import type { OrderSettlementPreviewResponseDto } from './dto/order-settlement-preview-response.dto';
import type { OrderSettlementResponseDto } from './dto/order-settlement-response.dto';
import type { OrderTransactionResponseDto } from './dto/order-transaction-response.dto';

@Injectable()
export class AdminOrderService {
  constructor(
    private readonly adminOrderRepository: AdminOrderRepository,
    private readonly notificationsService: NotificationsService,
  ) {}

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

  async getOrderSettlementPreview(
    orderId: string,
  ): Promise<OrderSettlementPreviewResponseDto> {
    const order =
      await this.adminOrderRepository.findOrderSettlementPreviewById(orderId);
    if (!order) {
      throw new AppException(ORDER_ERRORS.NOT_FOUND);
    }

    return {
      businessName: order.expertUser.expertProfile?.businessName ?? null,
      bankName: order.expertUser.bankName,
      bankAccount: order.expertUser.bankAccount,
      settlementAmount: order.agreedServicePrice,
    };
  }

  async completeSettlement(orderId: string, adminId: string): Promise<void> {
    const order =
      await this.adminOrderRepository.findOrderForSettlement(orderId);
    if (!order) {
      throw new AppException(ORDER_ERRORS.NOT_FOUND);
    }

    await this.adminOrderRepository.completeSettlement(orderId, adminId);

    await this.notificationsService.send({
      userIds: [order.expertUserId],
      category: NotificationCategory.SETTLEMENT_DONE,
      vars: { serviceTitle: order.service.title },
      referenceId: orderId,
    });
  }

  async getOrderSettlement(
    orderId: string,
  ): Promise<OrderSettlementResponseDto> {
    const order =
      await this.adminOrderRepository.findOrderSettlementById(orderId);
    if (!order?.payment?.approvedAt || !order.settledAt) {
      throw new AppException(ORDER_ERRORS.NOT_FOUND);
    }

    return {
      paidAt: order.payment.approvedAt,
      method: order.payment.method,
      installmentMonths: order.payment.installmentMonths,
      servicePrice: order.agreedServicePrice,
      platformFee: order.platformFee,
      settlementAmount: order.agreedServicePrice,
      settledAt: order.settledAt,
      settledByAdminName: order.settledByAdmin?.name ?? null,
    };
  }
}
