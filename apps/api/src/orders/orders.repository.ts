import { Injectable } from '@nestjs/common';
import { OrderStatus, PaymentStatus, Prisma } from '@prisma/client';

import { PAYMENT_ERRORS } from '../common/constants/errors';
import { AppException } from '../common/exceptions/app.exception';
import { PrismaService } from '../prisma/prisma.service';

import { DEFAULT_PAYMENT_METHOD } from './orders.constants';
import {
  orderListSelect,
  orderPolicySelect,
  orderSchedulePolicySelect,
} from './orders.types';

import type { OrderListSort } from './orders.constants';

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
