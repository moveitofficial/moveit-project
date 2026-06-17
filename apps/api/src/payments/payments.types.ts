import type { Prisma } from '@prisma/client';

export const orderPaymentSelect = {
  id: true,
  clientUserId: true,
  expertUserId: true,
  status: true,
  agreedServicePrice: true,
  platformFee: true,
  totalAmount: true,
  confirmedAt: true,
  settledAt: true,
  payment: {
    select: {
      id: true,
      status: true,
      method: true,
      paidAmount: true,
      installmentMonths: true,
      paymentKey: true,
      rawData: true,
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
export type OrderPaymentOrder = Omit<OrderPaymentRow, 'payment'> & {
  payment: OrderPaymentData;
};
