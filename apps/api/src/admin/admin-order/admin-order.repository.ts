import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

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
}
