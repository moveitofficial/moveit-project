import { Injectable } from '@nestjs/common';
import {
  AdminActionType,
  OrderStatus,
  PaymentStatus,
  Prisma,
  RefundStatus,
  RefundType,
} from '@prisma/client';

import {
  ORDER_ERRORS,
  PAYMENT_ERRORS,
  REFUND_ERRORS,
} from '../../common/constants/errors';
import { AppException } from '../../common/exceptions/app.exception';
import { PrismaService } from '../../prisma/prisma.service';

import { ORDER_TAB_STATUSES, type OrderTab } from './dto/list/orders-tab.enum';

import type { GetOrdersQueryDto } from './dto/list/orders-query.dto';
import type { GetSettlementsQueryDto } from './dto/list/settlements-query.dto';

@Injectable()
export class AdminOrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  findOrderTransactionById(orderId: string) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      select: {
        agreedServicePrice: true,
        platformFee: true,
        totalAmount: true,
        payment: {
          select: {
            approvedAt: true,
            method: true,
            installmentMonths: true,
          },
        },
      },
    });
  }

  findOrderRefundById(orderId: string) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      select: {
        agreedServicePrice: true,
        platformFee: true,
        payment: {
          select: {
            approvedAt: true,
            method: true,
            installmentMonths: true,
            refund: {
              select: {
                refundAmount: true,
                type: true,
                approvedAt: true,
                adminReason: true,
                approvedAdmin: { select: { name: true } },
                expertUser: { select: { name: true } },
              },
            },
          },
        },
      },
    });
  }

  findOrderSettlementPreviewById(orderId: string) {
    return this.prisma.order.findFirst({
      where: { id: orderId, status: OrderStatus.SETTLEMENT_REQUESTED },
      select: {
        agreedServicePrice: true,
        expertUser: {
          select: {
            bankName: true,
            bankAccount: true,
            expertProfile: {
              select: { businessName: true },
            },
          },
        },
      },
    });
  }

  findOrderForSettlement(orderId: string) {
    return this.prisma.order.findFirst({
      where: { id: orderId, status: OrderStatus.SETTLEMENT_REQUESTED },
      select: {
        expertUserId: true,
        service: { select: { title: true } },
      },
    });
  }

  completeSettlement(orderId: string, adminId: string) {
    return this.prisma.$transaction([
      this.prisma.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.SETTLEMENT_COMPLETED,
          settledAt: new Date(),
          settledByAdminId: adminId,
        },
      }),
      this.prisma.adminActivityLog.create({
        data: {
          adminId,
          actionType: AdminActionType.SETTLEMENT_COMPLETED,
          referenceId: orderId,
        },
      }),
    ]);
  }

  findOrderForAdminApprove(orderId: string) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      select: {
        status: true,
        clientUserId: true,
        expertUserId: true,
        agreedServicePrice: true,
        createdAt: true,
        service: {
          select: {
            title: true,
            serviceGroupId: true,
            serviceCategoryId: true,
          },
        },
        payment: {
          select: {
            paymentKey: true,
            paidAmount: true,
            status: true,
            refund: {
              select: {
                type: true,
                status: true,
              },
            },
          },
        },
      },
    });
  }

  approveCancelByAdmin(params: {
    orderId: string;
    refundAmount: number;
    canceledAt: Date;
    rawData: Prisma.InputJsonValue;
    adminId: string;
    adminReason: string;
  }) {
    return this.prisma.$transaction(async (tx) => {
      const { count } = await tx.order.updateMany({
        where: { id: params.orderId, status: OrderStatus.CANCEL_REQUESTED },
        data: { status: OrderStatus.PAYMENT_CANCELLED },
      });
      if (count === 0) throw new AppException(ORDER_ERRORS.INVALID_STATUS);

      const { count: paymentCount } = await tx.payment.updateMany({
        where: { orderId: params.orderId, status: PaymentStatus.PAID },
        data: {
          status: PaymentStatus.CANCELLED,
          rawData: params.rawData,
        },
      });
      if (paymentCount === 0) throw new AppException(PAYMENT_ERRORS.NOT_FOUND);

      const { count: refundCount } = await tx.refund.updateMany({
        where: {
          payment: { orderId: params.orderId },
          type: RefundType.CANCEL,
          status: RefundStatus.REQUESTED,
        },
        data: {
          status: RefundStatus.COMPLETED,
          refundAmount: params.refundAmount,
          approvedAt: params.canceledAt,
          refundedAt: params.canceledAt,
          approvedAdminId: params.adminId,
          adminReason: params.adminReason,
          rawData: params.rawData,
        },
      });
      if (refundCount === 0) throw new AppException(REFUND_ERRORS.NOT_FOUND);

      await tx.adminActivityLog.create({
        data: {
          adminId: params.adminId,
          actionType: AdminActionType.CANCEL_APPROVED,
          referenceId: params.orderId,
        },
      });
    });
  }

  approveRefundByAdmin(params: {
    orderId: string;
    refundAmount: number;
    canceledAt: Date;
    rawData: Prisma.InputJsonValue;
    adminId: string;
    adminReason: string;
  }) {
    return this.prisma.$transaction(async (tx) => {
      const { count } = await tx.order.updateMany({
        where: { id: params.orderId, status: OrderStatus.REFUND_REQUESTED },
        data: { status: OrderStatus.REFUND_COMPLETED },
      });
      if (count === 0) throw new AppException(ORDER_ERRORS.INVALID_STATUS);

      const { count: paymentCount } = await tx.payment.updateMany({
        where: { orderId: params.orderId, status: PaymentStatus.PAID },
        data: {
          status: PaymentStatus.REFUNDED,
          rawData: params.rawData,
        },
      });
      if (paymentCount === 0) throw new AppException(PAYMENT_ERRORS.NOT_FOUND);

      const { count: refundCount } = await tx.refund.updateMany({
        where: {
          payment: { orderId: params.orderId },
          type: RefundType.REFUND,
          status: RefundStatus.REQUESTED,
        },
        data: {
          status: RefundStatus.COMPLETED,
          refundAmount: params.refundAmount,
          approvedAt: params.canceledAt,
          refundedAt: params.canceledAt,
          approvedAdminId: params.adminId,
          adminReason: params.adminReason,
          rawData: params.rawData,
        },
      });
      if (refundCount === 0) throw new AppException(REFUND_ERRORS.NOT_FOUND);

      await tx.adminActivityLog.create({
        data: {
          adminId: params.adminId,
          actionType: AdminActionType.REFUND_APPROVED,
          referenceId: params.orderId,
        },
      });
    });
  }

  findOrderSettlementById(orderId: string) {
    return this.prisma.order.findFirst({
      where: { id: orderId, status: OrderStatus.SETTLEMENT_COMPLETED },
      select: {
        agreedServicePrice: true,
        platformFee: true,
        settledAt: true,
        payment: {
          select: {
            approvedAt: true,
            method: true,
            installmentMonths: true,
          },
        },
        settledByAdmin: {
          select: { name: true },
        },
      },
    });
  }

  countOrders(query: GetOrdersQueryDto): Promise<number> {
    return this.prisma.order.count({ where: this.#buildOrdersWhere(query) });
  }

  findOrders(query: GetOrdersQueryDto, skip: number, take: number) {
    return this.prisma.order.findMany({
      where: this.#buildOrdersWhere(query),
      skip,
      take,
      orderBy: this.#buildOrdersOrderBy(query.sort),
      select: {
        id: true,
        status: true,
        totalAmount: true,
        startDate: true,
        endDate: true,
        clientUser: {
          select: { id: true, name: true },
        },
        expertUser: {
          select: {
            id: true,
            expertProfile: { select: { businessName: true } },
          },
        },
        service: {
          select: {
            id: true,
            title: true,
            serviceGroup: { select: { name: true } },
            serviceCategory: { select: { name: true } },
            images: {
              where: { isMain: true },
              take: 1,
              select: { imgUrl: true },
            },
          },
        },
      },
    });
  }

  countOrdersByStatuses(statuses: OrderStatus[]): Promise<number> {
    if (statuses.length === 0) return this.prisma.order.count();
    return this.prisma.order.count({ where: { status: { in: statuses } } });
  }

  #buildOrdersWhere(query: GetOrdersQueryDto): Prisma.OrderWhereInput {
    const { tab, search } = query;
    const tabKey: OrderTab = tab ?? 'all';
    const statuses = tabKey === 'all' ? null : ORDER_TAB_STATUSES[tabKey];

    return {
      ...(statuses && { status: { in: statuses } }),
      ...(search && {
        OR: [
          { clientUser: { name: { contains: search, mode: 'insensitive' } } },
          {
            expertUser: {
              expertProfile: {
                businessName: { contains: search, mode: 'insensitive' },
              },
            },
          },
        ],
      }),
    };
  }

  #buildOrdersOrderBy(
    sort: GetOrdersQueryDto['sort'],
  ): Prisma.OrderOrderByWithRelationInput {
    if (sort === 'deadline') {
      return { endDate: { sort: 'asc', nulls: 'last' } };
    }
    return { createdAt: 'desc' };
  }

  countSettlements(query: GetSettlementsQueryDto): Promise<number> {
    return this.prisma.order.count({
      where: this.#buildSettlementsWhere(query),
    });
  }

  findSettlements(query: GetSettlementsQueryDto, skip: number, take: number) {
    return this.prisma.order.findMany({
      where: this.#buildSettlementsWhere(query),
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        status: true,
        totalAmount: true,
        startDate: true,
        endDate: true,
        settledAt: true,
        settledByAdmin: { select: { name: true } },
        clientUser: { select: { id: true, name: true } },
        expertUser: {
          select: {
            id: true,
            expertProfile: { select: { businessName: true } },
          },
        },
        service: {
          select: {
            id: true,
            title: true,
            serviceGroup: { select: { name: true } },
            serviceCategory: { select: { name: true } },
            images: {
              where: { isMain: true },
              take: 1,
              select: { imgUrl: true },
            },
          },
        },
      },
    });
  }

  async decrementStatistics(params: {
    sellerUserId: string;
    serviceGroupId: string;
    serviceCategoryId: string;
    agreedServicePrice: number;
    date: Date;
  }) {
    const {
      sellerUserId,
      serviceGroupId,
      serviceCategoryId,
      agreedServicePrice,
      date,
    } = params;
    await Promise.all([
      this.prisma.statisticsBySeller.update({
        where: { sellerUserId_date: { sellerUserId, date } },
        data: {
          totalTransactionAmount: { decrement: agreedServicePrice },
          totalTransactionCount: { decrement: 1 },
        },
      }),
      this.prisma.statisticsByCategory.update({
        where: {
          serviceGroupId_serviceCategoryId_date: {
            serviceGroupId,
            serviceCategoryId,
            date,
          },
        },
        data: {
          totalTransactionAmount: { decrement: agreedServicePrice },
          totalTransactionCount: { decrement: 1 },
        },
      }),
    ]);
  }

  #buildSettlementsWhere(
    query: GetSettlementsQueryDto,
  ): Prisma.OrderWhereInput {
    const { status, search } = query;

    return {
      status: status ?? {
        in: [
          OrderStatus.SETTLEMENT_REQUESTED,
          OrderStatus.SETTLEMENT_COMPLETED,
        ],
      },

      ...(search && {
        clientUser: { name: { contains: search, mode: 'insensitive' } },
      }),
    };
  }
}
