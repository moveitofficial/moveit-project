import { Injectable, Logger } from '@nestjs/common';
import {
  NotificationCategory,
  OrderStatus,
  PaymentStatus,
  RefundStatus,
  RefundType,
} from '@prisma/client';

import {
  ORDER_ERRORS,
  PAYMENT_ERRORS,
  REFUND_ERRORS,
} from '../../common/constants/errors';
import { AppException } from '../../common/exceptions/app.exception';
import { Paginated } from '../../common/types/paginated.type';
import { toPaginatedResponse } from '../../common/utils/list-response.util';
import { NotificationsService } from '../../notifications/notifications.service';
import { PaymentsService } from '../../payments/payments.service';

import { AdminOrderRepository } from './admin-order.repository';
import { ORDER_TAB_STATUSES, type OrderTab } from './dto/list/orders-tab.enum';

import type { OrdersCountsDto } from './dto/list/orders-counts-response.dto';
import type { GetOrdersQueryDto } from './dto/list/orders-query.dto';
import type { OrderItemDto } from './dto/list/orders-response.dto';
import type { GetSettlementsQueryDto } from './dto/list/settlements-query.dto';
import type { SettlementItemDto } from './dto/list/settlements-response.dto';
import type { OrderRefundResponseDto } from './dto/order-refund-response.dto';
import type { OrderSettlementPreviewResponseDto } from './dto/order-settlement-preview-response.dto';
import type { OrderSettlementResponseDto } from './dto/order-settlement-response.dto';
import type { OrderTransactionResponseDto } from './dto/order-transaction-response.dto';

@Injectable()
export class AdminOrderService {
  private readonly logger = new Logger(AdminOrderService.name);

  constructor(
    private readonly adminOrderRepository: AdminOrderRepository,
    private readonly notificationsService: NotificationsService,
    private readonly paymentsService: PaymentsService,
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
    if (!order?.payment?.approvedAt || !order.payment.refund) {
      throw new AppException(ORDER_ERRORS.NOT_FOUND);
    }

    const refund = order.payment.refund;

    const buildApprovedBy = () => {
      if (!refund.approvedAt) return null;
      return refund.approvedAdmin
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
    };

    return {
      paidAt: order.payment.approvedAt,
      method: order.payment.method,
      installmentMonths: order.payment.installmentMonths,
      servicePrice: order.agreedServicePrice,
      platformFee: order.platformFee,
      refundAmount: refund.refundAmount,
      type: refund.type,
      approvedAt: refund.approvedAt,
      approvedBy: buildApprovedBy(),
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

  async approveCancel(
    orderId: string,
    adminId: string,
    reason: string,
  ): Promise<void> {
    const order =
      await this.adminOrderRepository.findOrderForAdminApprove(orderId);
    this.assertApprovable(
      order,
      OrderStatus.CANCEL_REQUESTED,
      RefundType.CANCEL,
    );

    const { payment } = order;
    if (!payment?.paymentKey) throw new AppException(PAYMENT_ERRORS.NOT_FOUND);

    const { canceledAt, rawData } =
      await this.paymentsService.cancelTossPayment(
        payment.paymentKey,
        '관리자 취소 승인',
        payment.paidAmount,
      );

    try {
      await this.adminOrderRepository.approveCancelByAdmin({
        orderId,
        refundAmount: payment.paidAmount,
        canceledAt,
        rawData,
        adminId,
        adminReason: reason,
      });
    } catch (error) {
      this.logger.error(
        `Toss 취소 후 DB 갱신 실패. orderId=${orderId}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }

    await this.notifyApproved(
      order,
      orderId,
      reason,
      NotificationCategory.ORDER_CANCEL_APPROVED_BY_ADMIN,
      '관리자 취소 승인',
    );
  }

  async approveRefund(
    orderId: string,
    adminId: string,
    reason: string,
  ): Promise<void> {
    const order =
      await this.adminOrderRepository.findOrderForAdminApprove(orderId);
    this.assertApprovable(
      order,
      OrderStatus.REFUND_REQUESTED,
      RefundType.REFUND,
    );

    const { payment } = order;
    if (!payment?.paymentKey) throw new AppException(PAYMENT_ERRORS.NOT_FOUND);

    const { canceledAt, rawData } =
      await this.paymentsService.cancelTossPayment(
        payment.paymentKey,
        '관리자 환불 승인',
        payment.paidAmount,
      );

    try {
      await this.adminOrderRepository.approveRefundByAdmin({
        orderId,
        refundAmount: payment.paidAmount,
        canceledAt,
        rawData,
        adminId,
        adminReason: reason,
      });
    } catch (error) {
      this.logger.error(
        `Toss 환불 승인 후 DB 갱신 실패. orderId=${orderId}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }

    await this.notifyApproved(
      order,
      orderId,
      reason,
      NotificationCategory.REFUND_APPROVED_BY_ADMIN,
      '관리자 환불 승인',
    );
  }

  private assertApprovable(
    order: {
      status: OrderStatus;
      payment: {
        status: PaymentStatus;
        refund: { type: RefundType; status: RefundStatus } | null;
      } | null;
    } | null,
    expectedOrderStatus: OrderStatus,
    expectedRefundType: RefundType,
  ): asserts order is NonNullable<typeof order> {
    if (!order) throw new AppException(ORDER_ERRORS.NOT_FOUND);
    if (order.status !== expectedOrderStatus) {
      throw new AppException(ORDER_ERRORS.INVALID_STATUS);
    }
    if (order.payment?.status !== PaymentStatus.PAID) {
      throw new AppException(PAYMENT_ERRORS.NOT_FOUND);
    }
    const refund = order.payment.refund;
    if (
      refund?.type !== expectedRefundType ||
      refund.status !== RefundStatus.REQUESTED
    ) {
      throw new AppException(REFUND_ERRORS.NOT_APPROVABLE);
    }
  }

  private async notifyApproved(
    order: {
      clientUserId: string;
      expertUserId: string;
      service: { title: string };
    },
    orderId: string,
    adminReason: string,
    category: NotificationCategory,
    logLabel: string,
  ): Promise<void> {
    await this.notificationsService
      .send({
        userIds: [order.clientUserId, order.expertUserId],
        category,
        vars: { serviceTitle: order.service.title, adminReason },
        referenceId: orderId,
      })
      .catch((error: unknown) => {
        this.logger.error(
          `${logLabel} 알림 발송 실패. orderId=${orderId}`,
          error instanceof Error ? error.stack : String(error),
        );
      });
  }

  async getOrders(query: GetOrdersQueryDto): Promise<Paginated<OrderItemDto>> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 50;
    const skip = (page - 1) * pageSize;

    const [rows, totalCount] = await Promise.all([
      this.adminOrderRepository.findOrders(query, skip, pageSize),
      this.adminOrderRepository.countOrders(query),
    ]);

    const items: OrderItemDto[] = rows.map((o) => ({
      id: o.id,
      status: o.status,
      totalAmount: o.totalAmount,
      startDate: o.startDate,
      endDate: o.endDate,
      client: {
        id: o.clientUser.id,
        name: o.clientUser.name,
      },
      expert: {
        id: o.expertUser.id,
        businessName: o.expertUser.expertProfile?.businessName ?? null,
      },
      service: {
        id: o.service.id,
        title: o.service.title,
        thumbnailUrl: o.service.images[0]?.imgUrl ?? null,
        categoryGroup: o.service.serviceGroup.name,
        categoryName: o.service.serviceCategory.name,
      },
    }));

    return toPaginatedResponse(items, { page, pageSize, totalCount });
  }

  async getOrdersCounts(): Promise<OrdersCountsDto> {
    const tabs = Object.keys(ORDER_TAB_STATUSES) as Exclude<OrderTab, 'all'>[];
    const [all, ...counts] = await Promise.all([
      this.adminOrderRepository.countOrdersByStatuses([]),
      ...tabs.map((tab) =>
        this.adminOrderRepository.countOrdersByStatuses(
          ORDER_TAB_STATUSES[tab],
        ),
      ),
    ]);

    const result = { all } as OrdersCountsDto;
    for (const [i, tab] of tabs.entries()) {
      result[tab] = counts[i] ?? 0;
    }
    return result;
  }

  async getSettlements(
    query: GetSettlementsQueryDto,
  ): Promise<Paginated<SettlementItemDto>> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 50;
    const skip = (page - 1) * pageSize;

    const [rows, totalCount] = await Promise.all([
      this.adminOrderRepository.findSettlements(query, skip, pageSize),
      this.adminOrderRepository.countSettlements(query),
    ]);

    const items: SettlementItemDto[] = rows.map((o) => ({
      id: o.id,
      status: o.status as SettlementItemDto['status'],
      totalAmount: o.totalAmount,
      startDate: o.startDate,
      endDate: o.endDate,
      client: {
        id: o.clientUser.id,
        name: o.clientUser.name,
      },
      expert: {
        id: o.expertUser.id,
        businessName: o.expertUser.expertProfile?.businessName ?? null,
      },
      service: {
        id: o.service.id,
        title: o.service.title,
        thumbnailUrl: o.service.images[0]?.imgUrl ?? null,
        categoryGroup: o.service.serviceGroup.name,
        categoryName: o.service.serviceCategory.name,
      },
      settledAt: o.settledAt,
      settledByAdminName: o.settledByAdmin?.name ?? null,
    }));

    return toPaginatedResponse(items, { page, pageSize, totalCount });
  }
}
