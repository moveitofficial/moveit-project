import type { Prisma } from '@prisma/client';

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
