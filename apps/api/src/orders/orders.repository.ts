import { Injectable } from '@nestjs/common';
import { OrderStatus, PaymentStatus } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { INITIAL_PAID_AMOUNT } from './orders.constants';

@Injectable()
export class OrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

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
}
