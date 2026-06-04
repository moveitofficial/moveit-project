import { Injectable } from '@nestjs/common';
import { PaymentStatus, Prisma } from '@prisma/client';

import { PAYMENT_ERRORS } from '../common/constants/errors';
import { AppException } from '../common/exceptions/app.exception';
import { PrismaService } from '../prisma/prisma.service';

import { getOrderPaymentSelect, orderPaymentSelect } from './payments.types';

@Injectable()
export class PaymentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  // [P3] 순수 조회 전용 — totalAmount 미포함
  findOrderPaymentOnly(orderId: string) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      select: getOrderPaymentSelect,
    });
  }

  // confirmPayment 전용 — totalAmount 포함
  findOrderPayment(orderId: string) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      select: orderPaymentSelect,
    });
  }

  async updatePaymentStatus(
    paymentId: string,
    data: {
      paymentKey: string;
      paidAmount: number;
      approvedAt: Date;
      method: string;
      installmentMonths: number;
      rawData: Prisma.InputJsonValue;
    },
  ) {
    try {
      return await this.prisma.payment.updateMany({
        where: {
          id: paymentId,
          status: PaymentStatus.PENDING,
        },
        data: {
          status: PaymentStatus.PAID,
          paymentKey: data.paymentKey,
          paidAmount: data.paidAmount,
          approvedAt: data.approvedAt,
          method: data.method,
          installmentMonths: data.installmentMonths,
          rawData: data.rawData,
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
}
