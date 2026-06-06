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
}
