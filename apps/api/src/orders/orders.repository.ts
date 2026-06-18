import { Injectable } from '@nestjs/common';
import {
  OrderStatus,
  PaymentStatus,
  Prisma,
  RefundStatus,
  RefundType,
  SystemMessageType,
} from '@prisma/client';

import {
  ORDER_ERRORS,
  PAYMENT_ERRORS,
  REFUND_ERRORS,
} from '../common/constants/errors';
import { AppException } from '../common/exceptions/app.exception';
import { PrismaService } from '../prisma/prisma.service';
import {
  myReviewListSelect,
  ReviewWithUser,
  reviewWithUserSelect,
  ServiceReviewStats,
} from '../services/services.types';

import { LISTABLE_PAYMENT_STATUSES } from './orders.constants';
import {
  orderCancelApprovePolicySelect,
  orderCancelRequestPolicySelect,
  orderListSelect,
  orderPolicySelect,
  orderReviewSelect,
  orderScheduleChangePolicySelect,
  orderSchedulePolicySelect,
  orderStatusResponseSelect,
  pendingOrderForPaySelect,
} from './orders.types';

import type { OrderListSort } from './orders.constants';
import type {
  MyReviewListItem,
  MyReviewSort,
} from '../services/services.types';

function calcAvgRating(reviews: { rating: number }[]): number | null {
  if (reviews.length === 0) return null;
  return (
    Math.round(
      (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10,
    ) / 10
  );
}

@Injectable()
export class OrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOrdersByUser(params: {
    userId: string;
    field: 'clientUserId' | 'expertUserId';
    statuses?: OrderStatus[];
    sort: OrderListSort;
    skip: number;
    take: number;
    search?: string;
  }) {
    const { userId, field, statuses, sort, skip, take, search } = params;
    const userWhere: Prisma.OrderWhereInput =
      field === 'clientUserId'
        ? { clientUserId: userId }
        : { expertUserId: userId };
    const statusWhere: Prisma.OrderWhereInput = statuses?.length
      ? { status: { in: statuses } }
      : {};
    const paymentWhere: Prisma.OrderWhereInput = {
      payment: { is: { status: { in: LISTABLE_PAYMENT_STATUSES } } },
    };
    const searchWhere: Prisma.OrderWhereInput = search
      ? field === 'clientUserId'
        ? {
            expertUser: {
              expertProfile: {
                businessName: { contains: search, mode: 'insensitive' },
              },
            },
          }
        : { clientUser: { name: { contains: search, mode: 'insensitive' } } }
      : {};

    return this.prisma.order.findMany({
      where: { ...userWhere, ...statusWhere, ...paymentWhere, ...searchWhere },
      select: orderListSelect,
      orderBy: sort === 'deadline' ? { endDate: 'asc' } : { createdAt: 'desc' },
      skip,
      take,
    });
  }

  async countOrdersByUser(params: {
    userId: string;
    field: 'clientUserId' | 'expertUserId';
    statuses?: OrderStatus[];
    search?: string;
  }) {
    const { userId, field, statuses, search } = params;
    const userWhere: Prisma.OrderWhereInput =
      field === 'clientUserId'
        ? { clientUserId: userId }
        : { expertUserId: userId };
    const statusWhere: Prisma.OrderWhereInput = statuses?.length
      ? { status: { in: statuses } }
      : {};
    const paymentWhere: Prisma.OrderWhereInput = {
      payment: { is: { status: { in: LISTABLE_PAYMENT_STATUSES } } },
    };
    const searchWhere: Prisma.OrderWhereInput = search
      ? field === 'clientUserId'
        ? {
            expertUser: {
              expertProfile: {
                businessName: { contains: search, mode: 'insensitive' },
              },
            },
          }
        : { clientUser: { name: { contains: search, mode: 'insensitive' } } }
      : {};

    return this.prisma.order.count({
      where: { ...userWhere, ...statusWhere, ...paymentWhere, ...searchWhere },
    });
  }

  // 일정 변경 요청 대기 주문 id 집합 — 주문별 최신 일정 시스템 메시지가
  // SCHEDULE_CHANGE_REQUEST(그 뒤 SCHEDULE_REGISTERED 없음)인 경우만 대기로 판단
  async findPendingScheduleChangeOrderIds(
    orderIds: string[],
  ): Promise<Set<string>> {
    if (orderIds.length === 0) {
      return new Set();
    }

    const messages = await this.prisma.message.findMany({
      where: {
        orderId: { in: orderIds },
        systemType: {
          in: [
            SystemMessageType.SCHEDULE_CHANGE_REQUEST,
            SystemMessageType.SCHEDULE_REGISTERED,
          ],
        },
      },
      select: { orderId: true, systemType: true },
      orderBy: { createdAt: 'desc' },
    });

    const pending = new Set<string>();
    const resolved = new Set<string>();
    for (const message of messages) {
      if (message.orderId === null || resolved.has(message.orderId)) {
        continue;
      }
      resolved.add(message.orderId);
      if (message.systemType === SystemMessageType.SCHEDULE_CHANGE_REQUEST) {
        pending.add(message.orderId);
      }
    }
    return pending;
  }

  findServiceById(serviceId: string) {
    return this.prisma.service.findUnique({
      where: { id: serviceId },
    });
  }

  updateOrderChatRoomId(orderId: string, chatRoomId: string) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { chatRoomId },
      select: { id: true },
    });
  }

  async findOrderPolicy(orderId: string) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      select: orderPolicySelect,
    });
  }

  async findOrderSchedulePolicy(orderId: string) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      select: orderSchedulePolicySelect,
    });
  }

  async findOrderForReview(orderId: string) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      select: orderReviewSelect,
    });
  }

  async createReview(data: {
    orderId: string;
    userId: string;
    expertUserId: string;
    rating: number;
    content: string;
  }): Promise<ReviewWithUser> {
    return this.prisma.$transaction(async (tx) => {
      const review = await tx.review.create({
        data: {
          orderId: data.orderId,
          userId: data.userId,
          rating: data.rating,
          content: data.content,
        },
        select: reviewWithUserSelect,
      });

      const allReviews = await tx.review.findMany({
        where: { order: { expertUserId: data.expertUserId } },
        select: { rating: true },
      });
      await tx.expertProfile.update({
        where: { userId: data.expertUserId },
        data: {
          avgRating: calcAvgRating(allReviews),
          reviewCount: allReviews.length,
        },
      });

      return review;
    });
  }

  findReviewById(
    reviewId: string,
    orderId: string,
  ): Promise<ReviewWithUser | null> {
    return this.prisma.review.findFirst({
      where: {
        id: reviewId,
        order: { id: orderId },
      },
      select: reviewWithUserSelect,
    });
  }

  async getReviewStatsByOrderIds(
    orderIds: string[],
  ): Promise<Map<string, ServiceReviewStats>> {
    if (orderIds.length === 0) {
      return new Map();
    }

    const reviews = await this.prisma.review.findMany({
      where: { orderId: { in: orderIds } },
      select: {
        orderId: true,
        rating: true,
      },
    });

    const acc = new Map<string, { sum: number; count: number }>();
    for (const review of reviews) {
      const cur = acc.get(review.orderId) ?? { sum: 0, count: 0 };
      acc.set(review.orderId, {
        sum: cur.sum + review.rating,
        count: cur.count + 1,
      });
    }

    const result = new Map<string, ServiceReviewStats>();
    for (const orderId of orderIds) {
      const bucket = acc.get(orderId);
      const count = bucket?.count ?? 0;
      result.set(orderId, {
        reviewCount: count,
        rating:
          count > 0 ? Math.round(((bucket?.sum ?? 0) / count) * 10) / 10 : 0,
      });
    }
    return result;
  }

  async updateReview(
    reviewId: string,
    expertUserId: string,
    data: {
      rating?: number;
      content?: string;
    },
  ): Promise<ReviewWithUser> {
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.review.update({
        where: { id: reviewId },
        data,
        select: reviewWithUserSelect,
      });

      if (data.rating !== undefined) {
        const allReviews = await tx.review.findMany({
          where: { order: { expertUserId } },
          select: { rating: true },
        });
        await tx.expertProfile.update({
          where: { userId: expertUserId },
          data: { avgRating: calcAvgRating(allReviews) },
        });
      }

      return updated;
    });
  }

  async deleteReview(reviewId: string, expertUserId: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.review.delete({ where: { id: reviewId } });

      const allReviews = await tx.review.findMany({
        where: { order: { expertUserId } },
        select: { rating: true },
      });
      await tx.expertProfile.update({
        where: { userId: expertUserId },
        data: {
          avgRating: calcAvgRating(allReviews),
          reviewCount: allReviews.length,
        },
      });
    });
  }

  findAllReviewsByUserId(args: {
    userId: string;
    skip: number;
    take: number;
    sort: MyReviewSort;
  }): Promise<MyReviewListItem[]> {
    const orderBy =
      args.sort === 'oldest'
        ? { createdAt: 'asc' as const }
        : { createdAt: 'desc' as const };

    return this.prisma.review.findMany({
      where: { userId: args.userId },
      select: myReviewListSelect,
      orderBy,
      skip: args.skip,
      take: args.take,
    });
  }

  countReviewsByUserId(userId: string): Promise<number> {
    return this.prisma.review.count({
      where: { userId },
    });
  }

  async createOrder(data: {
    id: string;
    clientUserId: string;
    expertUserId: string;
    serviceId: string;
    agreedServicePrice: number;
    platformFee: number;
    totalAmount: number;
    paymentKey: string;
    approvedAt: Date;
    method: string;
    installmentMonths: number;
    rawData: Prisma.InputJsonValue;
  }) {
    try {
      const created = await this.prisma.order.create({
        data: {
          id: data.id,
          clientUserId: data.clientUserId,
          expertUserId: data.expertUserId,
          serviceId: data.serviceId,
          agreedServicePrice: data.agreedServicePrice,
          platformFee: data.platformFee,
          totalAmount: data.totalAmount,
          status: OrderStatus.NEGOTIATING,
          startDate: new Date(),
          endDate: null,
          payment: {
            create: {
              clientUserId: data.clientUserId,
              status: PaymentStatus.PAID,
              paidAmount: data.totalAmount,
              method: data.method,
              installmentMonths: data.installmentMonths,
              paymentKey: data.paymentKey,
              rawData: data.rawData,
              approvedAt: data.approvedAt,
            },
          },
        },
        include: { payment: true },
      });
      return created as typeof created & {
        payment: NonNullable<typeof created.payment>;
      };
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const target = error.meta?.target;
        const targets = Array.isArray(target) ? target : [];
        if (targets.includes('payment_key')) {
          throw new AppException(PAYMENT_ERRORS.DUPLICATE_PAYMENT_KEY);
        }
        if (targets.includes('id')) {
          throw new AppException(ORDER_ERRORS.DUPLICATE_ORDER_ID);
        }
      }
      throw error;
    }
  }

  async findPendingOrderForPay(orderId: string) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      select: pendingOrderForPaySelect,
    });
  }

  async findOrderForScheduleChangeRequest(orderId: string) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      select: orderScheduleChangePolicySelect,
    });
  }

  async payPendingOrder(data: {
    orderId: string;
    clientUserId: string;
    totalAmount: number;
    paymentKey: string;
    approvedAt: Date;
    method: string;
    installmentMonths: number;
    rawData: Prisma.InputJsonValue;
  }) {
    try {
      const { count } = await this.prisma.order.updateMany({
        where: { id: data.orderId, status: OrderStatus.PENDING },
        data: { status: OrderStatus.NEGOTIATING, startDate: new Date() },
      });
      if (count === 0) return null;

      await this.prisma.payment.create({
        data: {
          orderId: data.orderId,
          clientUserId: data.clientUserId,
          status: PaymentStatus.PAID,
          paidAmount: data.totalAmount,
          method: data.method,
          installmentMonths: data.installmentMonths,
          paymentKey: data.paymentKey,
          rawData: data.rawData,
          approvedAt: data.approvedAt,
        },
      });

      const result = await this.prisma.order.findUnique({
        where: { id: data.orderId },
        include: { payment: true },
      });
      return result as typeof result & {
        payment: NonNullable<NonNullable<typeof result>['payment']>;
      };
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const target = error.meta?.target;
        const targets = Array.isArray(target) ? target : [];
        if (targets.includes('payment_key')) {
          throw new AppException(PAYMENT_ERRORS.DUPLICATE_PAYMENT_KEY);
        }
      }
      throw error;
    }
  }

  async updateOrderStatusOnly(
    orderId: string,
    fromStatus: OrderStatus,
    toStatus: OrderStatus,
  ) {
    const { count } = await this.prisma.order.updateMany({
      where: { id: orderId, status: fromStatus },
      data: {
        status: toStatus,
        ...(toStatus === OrderStatus.PURCHASE_CONFIRMED && {
          confirmedAt: new Date(),
        }),
      },
    });
    if (count === 0) return null;

    return this.prisma.order.findUnique({ where: { id: orderId } });
  }

  async updateOrderSchedule(params: {
    orderId: string;
    fromStatus: OrderStatus;
    endDate: Date;
    toStatus?: OrderStatus;
  }) {
    const { orderId, fromStatus, endDate, toStatus } = params;

    const { count } = await this.prisma.order.updateMany({
      where: { id: orderId, status: fromStatus },
      data: {
        endDate,
        ...(toStatus !== undefined && { status: toStatus }),
      },
    });
    if (count === 0) return null;

    return this.prisma.order.findUnique({ where: { id: orderId } });
  }

  //마감 임박 대상 조회
  async findOrdersToImminent(now: Date, threshold: Date) {
    return this.prisma.order.findMany({
      where: {
        status: OrderStatus.IN_PROGRESS,
        endDate: { gt: now, lte: threshold },
      },
      select: {
        id: true,
        clientUserId: true,
        expertUserId: true,
        service: { select: { title: true } },
      },
    });
  }

  findOrderCancelRequestPolicy(orderId: string) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      select: orderCancelRequestPolicySelect,
    });
  }

  findOrderCancelApprovePolicy(orderId: string) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      select: orderCancelApprovePolicySelect,
    });
  }

  async requestCancel(params: {
    orderId: string;
    clientUserId: string;
    expertUserId: string;
    paidAmount: number;
    paymentKey: string;
  }) {
    return this.prisma.$transaction(async (tx) => {
      const { count } = await tx.order.updateMany({
        where: { id: params.orderId, status: OrderStatus.NEGOTIATING },
        data: { status: OrderStatus.CANCEL_REQUESTED },
      });
      if (count === 0) throw new AppException(ORDER_ERRORS.INVALID_STATUS);

      return tx.order.update({
        where: { id: params.orderId },
        data: {
          payment: {
            update: {
              refund: {
                upsert: {
                  create: {
                    clientUserId: params.clientUserId,
                    expertUserId: params.expertUserId,
                    type: RefundType.CANCEL,
                    status: RefundStatus.REQUESTED,
                    refundAmount: params.paidAmount,
                    paymentKey: params.paymentKey,
                    requestedAt: new Date(),
                  },
                  update: {
                    type: RefundType.CANCEL,
                    status: RefundStatus.REQUESTED,
                    refundAmount: params.paidAmount,
                    paymentKey: params.paymentKey,
                    requestedAt: new Date(),
                    approvedAt: null,
                    refundedAt: null,
                    adminReason: null,
                    approvedAdminId: null,
                    rawData: Prisma.JsonNull,
                  },
                },
              },
            },
          },
        },
        select: orderStatusResponseSelect,
      });
    });
  }

  async approveCancel(params: {
    orderId: string;
    refundAmount: number;
    canceledAt: Date;
    rawData: Prisma.InputJsonValue;
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
          rawData: params.rawData,
        },
      });
      if (refundCount === 0) throw new AppException(REFUND_ERRORS.NOT_FOUND);

      return tx.order.findUniqueOrThrow({
        where: { id: params.orderId },
        select: orderStatusResponseSelect,
      });
    });
  }

  async rejectCancel(orderId: string) {
    return this.prisma.$transaction(async (tx) => {
      const { count } = await tx.order.updateMany({
        where: { id: orderId, status: OrderStatus.CANCEL_REQUESTED },
        data: { status: OrderStatus.NEGOTIATING },
      });
      if (count === 0) throw new AppException(ORDER_ERRORS.INVALID_STATUS);

      const { count: refundCount } = await tx.refund.updateMany({
        where: {
          payment: { orderId },
          type: RefundType.CANCEL,
          status: RefundStatus.REQUESTED,
        },
        data: { status: RefundStatus.REJECTED },
      });
      if (refundCount === 0) throw new AppException(REFUND_ERRORS.NOT_FOUND);

      return tx.order.findUniqueOrThrow({
        where: { id: orderId },
        select: orderStatusResponseSelect,
      });
    });
  }

  async approveRefund(params: {
    orderId: string;
    refundAmount: number;
    canceledAt: Date;
    rawData: Prisma.InputJsonValue;
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
          rawData: params.rawData,
        },
      });
      if (refundCount === 0) throw new AppException(REFUND_ERRORS.NOT_FOUND);

      return tx.order.findUniqueOrThrow({
        where: { id: params.orderId },
        select: orderStatusResponseSelect,
      });
    });
  }

  async rejectRefund(orderId: string) {
    return this.prisma.$transaction(async (tx) => {
      const { count } = await tx.order.updateMany({
        where: { id: orderId, status: OrderStatus.REFUND_REQUESTED },
        data: { status: OrderStatus.EXPIRED },
      });
      if (count === 0) throw new AppException(ORDER_ERRORS.INVALID_STATUS);

      const { count: refundCount } = await tx.refund.updateMany({
        where: {
          payment: { orderId },
          type: RefundType.REFUND,
          status: RefundStatus.REQUESTED,
        },
        data: { status: RefundStatus.REJECTED },
      });
      if (refundCount === 0) throw new AppException(REFUND_ERRORS.NOT_FOUND);

      return tx.order.findUniqueOrThrow({
        where: { id: orderId },
        select: orderStatusResponseSelect,
      });
    });
  }

  async cancelRefundRequest(orderId: string) {
    return this.prisma.$transaction(async (tx) => {
      const { count } = await tx.order.updateMany({
        where: { id: orderId, status: OrderStatus.REFUND_REQUESTED },
        data: { status: OrderStatus.EXPIRED },
      });
      if (count === 0) throw new AppException(ORDER_ERRORS.INVALID_STATUS);

      const { count: refundCount } = await tx.refund.updateMany({
        where: {
          payment: { orderId },
          type: RefundType.REFUND,
          status: RefundStatus.REQUESTED,
        },
        data: { status: RefundStatus.REJECTED },
      });
      if (refundCount === 0) throw new AppException(REFUND_ERRORS.NOT_FOUND);

      return tx.order.findUniqueOrThrow({
        where: { id: orderId },
        select: orderStatusResponseSelect,
      });
    });
  }

  async requestRefund(params: {
    orderId: string;
    clientUserId: string;
    expertUserId: string;
    paidAmount: number;
    paymentKey: string;
  }) {
    return this.prisma.$transaction(async (tx) => {
      const { count } = await tx.order.updateMany({
        where: { id: params.orderId, status: OrderStatus.EXPIRED },
        data: { status: OrderStatus.REFUND_REQUESTED },
      });
      if (count === 0) throw new AppException(ORDER_ERRORS.INVALID_STATUS);

      return tx.order.update({
        where: { id: params.orderId },
        data: {
          payment: {
            update: {
              refund: {
                upsert: {
                  create: {
                    clientUserId: params.clientUserId,
                    expertUserId: params.expertUserId,
                    type: RefundType.REFUND,
                    status: RefundStatus.REQUESTED,
                    refundAmount: params.paidAmount,
                    paymentKey: params.paymentKey,
                    requestedAt: new Date(),
                  },
                  update: {
                    type: RefundType.REFUND,
                    status: RefundStatus.REQUESTED,
                    refundAmount: params.paidAmount,
                    paymentKey: params.paymentKey,
                    requestedAt: new Date(),
                    approvedAt: null,
                    refundedAt: null,
                    adminReason: null,
                    approvedAdminId: null,
                    rawData: Prisma.JsonNull,
                  },
                },
              },
            },
          },
        },
        select: orderStatusResponseSelect,
      });
    });
  }

  async findOrdersToExpire(now: Date) {
    return this.prisma.order.findMany({
      where: {
        status: {
          in: [OrderStatus.IN_PROGRESS, OrderStatus.DEADLINE_IMMINENT],
        },
        endDate: { lte: now },
      },
      select: {
        id: true,
        clientUserId: true,
        expertUserId: true,
        service: { select: { title: true } },
      },
    });
  }

  async updateOrdersStatus(orderIds: string[], status: OrderStatus) {
    if (orderIds.length === 0) return;
    await this.prisma.order.updateMany({
      where: { id: { in: orderIds } },
      data: { status },
    });
  }

  async findOrdersToPendingExpiry(threshold: Date) {
    return this.prisma.order.findMany({
      where: { status: OrderStatus.PENDING, createdAt: { lte: threshold } },
      select: {
        id: true,
        clientUserId: true,
        expertUserId: true,
        agreedServicePrice: true,
        platformFee: true,
        totalAmount: true,
        service: { select: { title: true } },
      },
    });
  }

  async upsertStatistics(params: {
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
      this.prisma.statisticsBySeller.upsert({
        where: { sellerUserId_date: { sellerUserId, date } },
        create: {
          sellerUserId,
          date,
          totalTransactionAmount: agreedServicePrice,
          totalTransactionCount: 1,
          maxTransactionAmount: agreedServicePrice,
        },
        update: {
          totalTransactionAmount: { increment: agreedServicePrice },
          totalTransactionCount: { increment: 1 },
        },
      }),
      this.prisma.statisticsByCategory.upsert({
        where: {
          serviceGroupId_serviceCategoryId_date: {
            serviceGroupId,
            serviceCategoryId,
            date,
          },
        },
        create: {
          serviceGroupId,
          serviceCategoryId,
          date,
          totalTransactionAmount: agreedServicePrice,
          totalTransactionCount: 1,
          maxTransactionAmount: agreedServicePrice,
        },
        update: {
          totalTransactionAmount: { increment: agreedServicePrice },
          totalTransactionCount: { increment: 1 },
        },
      }),
    ]);
    await Promise.all([
      this.prisma.statisticsBySeller.updateMany({
        where: {
          sellerUserId,
          date,
          maxTransactionAmount: { lt: agreedServicePrice },
        },
        data: { maxTransactionAmount: agreedServicePrice },
      }),
      this.prisma.statisticsByCategory.updateMany({
        where: {
          serviceGroupId,
          serviceCategoryId,
          date,
          maxTransactionAmount: { lt: agreedServicePrice },
        },
        data: { maxTransactionAmount: agreedServicePrice },
      }),
    ]);
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

  async findRoomIdsByOrderIds(
    orderIds: string[],
  ): Promise<Map<string, string>> {
    const messages = await this.prisma.message.findMany({
      where: {
        orderId: { in: orderIds },
        systemType: SystemMessageType.TRADE_REQUEST,
      },
      select: { chatRoomId: true, orderId: true },
      distinct: ['orderId'],
    });
    return new Map(
      messages
        .filter((m): m is typeof m & { orderId: string } => m.orderId !== null)
        .map((m) => [m.orderId, m.chatRoomId]),
    );
  }
}
