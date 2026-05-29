import { Injectable } from '@nestjs/common';
import { OrderStatus, PaymentStatus, Prisma } from '@prisma/client';

import { ORDER_ERRORS, PAYMENT_ERRORS } from '../common/constants/errors';
import { AppException } from '../common/exceptions/app.exception';
import { PrismaService } from '../prisma/prisma.service';

import { INITIAL_PAID_AMOUNT } from './orders.constants';
import { orderDetailSelect, orderListSelect } from './orders.types';

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

  async findOrderDetail(orderId: string) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      select: orderDetailSelect,
    });
  }

  findServiceById(serviceId: string) {
    return this.prisma.service.findUnique({
      where: { id: serviceId },
    });
  }

  async findOrderWithPayment(orderId: string) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });
  }

  async createPendingOrder(data: {
    clientUserId: string;
    expertUserId: string;
    serviceId: string;
    agreedServicePrice: number;
    platformFee: number;
    totalAmount: number;
    startDate: Date;
    endDate: Date;
    paymentMethod: string;
  }) {
    return this.prisma.order.create({
      data: {
        clientUserId: data.clientUserId,
        expertUserId: data.expertUserId,
        serviceId: data.serviceId,
        agreedServicePrice: data.agreedServicePrice,
        platformFee: data.platformFee,
        totalAmount: data.totalAmount,
        status: OrderStatus.NEGOTIATING,
        startDate: data.startDate,
        endDate: data.endDate,
        payment: {
          create: {
            clientUserId: data.clientUserId,
            paidAmount: INITIAL_PAID_AMOUNT,
            status: PaymentStatus.PENDING,
            method: data.paymentMethod,
          },
        },
      },
    });
  }

  async updateOrderAndPaymentToPaid(
    orderId: string,
    paymentKey: string,
    paidAmount: number,
    rawData: Prisma.InputJsonValue,
  ) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const { count: paymentCount } = await tx.payment.updateMany({
          where: {
            orderId,
            status: { in: [PaymentStatus.PENDING, PaymentStatus.FAILED] },
          },
          data: {
            status: PaymentStatus.PAID,
            paidAmount,
            paymentKey,
            rawData,
            approvedAt: new Date(),
          },
        });
        if (paymentCount === 0) return null;

        const { count: orderCount } = await tx.order.updateMany({
          where: { id: orderId, status: OrderStatus.NEGOTIATING },
          data: { status: OrderStatus.IN_PROGRESS },
        });
        if (orderCount === 0) {
          throw new AppException(ORDER_ERRORS.ALREADY_PROCESSED);
        }

        return tx.order.findUnique({
          where: { id: orderId },
          include: { payment: true },
        });
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

    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });
  }

  async updatePaymentToFailed(orderId: string, rawData: Prisma.InputJsonValue) {
    const { count } = await this.prisma.payment.updateMany({
      where: {
        orderId,
        status: { in: [PaymentStatus.PENDING, PaymentStatus.FAILED] },
      },
      data: {
        status: PaymentStatus.FAILED,
        rawData,
      },
    });
    return count > 0;
  }
}
