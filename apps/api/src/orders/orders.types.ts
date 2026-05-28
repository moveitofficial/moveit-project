import { ORDER_LIST_MAIN_IMAGE_LIMIT } from './orders.constants';

import type { Prisma } from '@prisma/client';

export type OrderWithPayment = Prisma.OrderGetPayload<{
  include: { payment: true };
}>;

export const orderListSelect = {
  id: true,
  status: true,
  totalAmount: true,
  agreedServicePrice: true,
  platformFee: true,
  startDate: true,
  endDate: true,
  createdAt: true,
  service: {
    select: {
      id: true,
      title: true,
      servicePrice: true,
      images: {
        where: { isMain: true },
        take: ORDER_LIST_MAIN_IMAGE_LIMIT,
        select: { imgUrl: true },
      },
    },
  },
  clientUser: {
    select: { id: true, name: true },
  },
  expertUser: {
    select: { id: true, name: true, profileImageUrl: true },
  },
} satisfies Prisma.OrderSelect;

export const orderDetailSelect = {
  id: true,
  clientUserId: true,
  expertUserId: true,
  status: true,
  totalAmount: true,
  agreedServicePrice: true,
  platformFee: true,
  refundReason: true,
  startDate: true,
  endDate: true,
  createdAt: true,
  confirmedAt: true,
  settledAt: true,
  service: {
    select: {
      id: true,
      title: true,
      servicePrice: true,
      workDuration: true,
      revisionCount: true,
      serviceScope: true,
      description: true,
      preparationNotes: true,
      refundPolicy: true,
    },
  },
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

export type OrderDetailRow = Prisma.OrderGetPayload<{
  select: typeof orderDetailSelect;
}>;
