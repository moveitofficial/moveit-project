import type { Prisma } from '@prisma/client';

// getOrderPayment 전용 (totalAmount 제외)
export const getOrderPaymentSelect = {
  id: true,
  clientUserId: true,
  expertUserId: true,
  payment: {
    select: {
      id: true,
      status: true,
      method: true,
      paidAmount: true,
      installmentMonths: true,
      paymentKey: true,
      createdAt: true,
      approvedAt: true,
      refund: {
        select: {
          id: true,
          type: true,
          status: true,
          refundAmount: true,
          adminReason: true,
          requestedAt: true,
          approvedAt: true,
          refundedAt: true,
        },
      },
    },
  },
} satisfies Prisma.OrderSelect;

// confirmPayment 전용 (금액 검증을 위해 totalAmount 포함)
export const orderPaymentSelect = {
  id: true,
  clientUserId: true,
  expertUserId: true,
  totalAmount: true,
  payment: {
    select: {
      id: true,
      status: true,
      method: true,
      paidAmount: true,
      installmentMonths: true,
      paymentKey: true,
      createdAt: true,
      approvedAt: true,
      refund: {
        select: {
          id: true,
          type: true,
          status: true,
          refundAmount: true,
          adminReason: true,
          requestedAt: true,
          approvedAt: true,
          refundedAt: true,
        },
      },
    },
  },
} satisfies Prisma.OrderSelect;

type OrderPaymentRow = Prisma.OrderGetPayload<{
  select: typeof orderPaymentSelect;
}>;

export type OrderPaymentData = NonNullable<OrderPaymentRow['payment']>;
