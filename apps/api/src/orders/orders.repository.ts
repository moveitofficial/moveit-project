import { Injectable } from '@nestjs/common';
import { OrderStatus, PaymentStatus, Prisma } from '@prisma/client';

import { PAYMENT_ERRORS } from '../common/constants/errors';
import { AppException } from '../common/exceptions/app.exception';
import { PrismaService } from '../prisma/prisma.service';
import {
  myReviewListSelect,
  ReviewWithUser,
  reviewWithUserSelect,
  ServiceReviewSort,
  ServiceReviewStats,
} from '../services/services.types';

import { DEFAULT_PAYMENT_METHOD } from './orders.constants';
import {
  orderListSelect,
  orderPolicySelect,
  orderReviewSelect,
  orderSchedulePolicySelect,
} from './orders.types';

import type { OrderListSort } from './orders.constants';
import type {
  MyReviewListItem,
  MyReviewSort,
} from '../services/services.types';

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
  }) {
    const { userId, field, statuses, sort, skip, take } = params;
    const userWhere: Prisma.OrderWhereInput =
      field === 'clientUserId'
        ? { clientUserId: userId }
        : { expertUserId: userId };
    const statusWhere: Prisma.OrderWhereInput = statuses?.length
      ? { status: { in: statuses } }
      : {};

    return this.prisma.order.findMany({
      where: { ...userWhere, ...statusWhere },
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
  }) {
    const { userId, field, statuses } = params;
    const userWhere: Prisma.OrderWhereInput =
      field === 'clientUserId'
        ? { clientUserId: userId }
        : { expertUserId: userId };
    const statusWhere: Prisma.OrderWhereInput = statuses?.length
      ? { status: { in: statuses } }
      : {};

    return this.prisma.order.count({ where: { ...userWhere, ...statusWhere } });
  }

  findServiceById(serviceId: string) {
    return this.prisma.service.findUnique({
      where: { id: serviceId },
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

  createReview(data: {
    orderId: string;
    userId: string;
    rating: number;
    content: string;
  }): Promise<ReviewWithUser> {
    return this.prisma.review.create({
      data: {
        orderId: data.orderId,
        userId: data.userId,
        rating: data.rating,
        content: data.content,
      },
      select: reviewWithUserSelect,
    });
  }

  countReviews(orderId: string): Promise<number> {
    return this.prisma.review.count({
      where: { order: { id: orderId } },
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

  findReviews(args: {
    orderId: string;
    skip: number;
    take: number;
    sort: ServiceReviewSort;
  }): Promise<ReviewWithUser[]> {
    const orderBy =
      args.sort === 'rating'
        ? { rating: 'desc' as const }
        : { createdAt: 'desc' as const };

    return this.prisma.review.findMany({
      where: { order: { id: args.orderId } },
      select: reviewWithUserSelect,
      orderBy,
      skip: args.skip,
      take: args.take,
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

  updateReview(
    reviewId: string,
    data: {
      rating?: number;
      content?: string;
    },
  ): Promise<ReviewWithUser> {
    return this.prisma.review.update({
      where: { id: reviewId },
      data,
      select: reviewWithUserSelect,
    });
  }

  async deleteReview(reviewId: string): Promise<void> {
    await this.prisma.review.delete({
      where: { id: reviewId },
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

  async createPaidOrder(data: {
    clientUserId: string;
    expertUserId: string;
    serviceId: string;
    agreedServicePrice: number;
    platformFee: number;
    totalAmount: number;
    paymentKey: string;
    paidAmount: number;
    rawData: Prisma.InputJsonValue;
  }) {
    try {
      return await this.prisma.order.create({
        data: {
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
              paidAmount: data.paidAmount,
              status: PaymentStatus.PAID,
              method: DEFAULT_PAYMENT_METHOD,
              paymentKey: data.paymentKey,
              rawData: data.rawData,
              approvedAt: new Date(),
            },
          },
        },
      });
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new AppException(PAYMENT_ERRORS.DUPLICATE_PAYMENT_KEY);
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
}
