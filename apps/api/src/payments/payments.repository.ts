import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { orderPaymentSelect } from './payments.types';

@Injectable()
export class PaymentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findOrderPayment(orderId: string) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      select: orderPaymentSelect,
    });
  }
}
