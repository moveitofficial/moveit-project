import { Injectable } from '@nestjs/common';
import { AdminActionType, OrderStatus } from '@prisma/client';

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
}
