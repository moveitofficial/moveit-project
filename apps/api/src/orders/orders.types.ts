import { ORDER_LIST_MAIN_IMAGE_LIMIT } from './orders.constants';

import type { Prisma } from '@prisma/client';

export const orderListSelect = {
  id: true,
  status: true,
  totalAmount: true,
  agreedServicePrice: true,
  platformFee: true,
  startDate: true,
  endDate: true,
  createdAt: true,
  chatRoomId: true,
  service: {
    select: {
      id: true,
      title: true,
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
    select: {
      id: true,
      profileImageUrl: true,
      expertProfile: { select: { businessName: true } },
    },
  },
} satisfies Prisma.OrderSelect;

export type OrderListRow = Prisma.OrderGetPayload<{
  select: typeof orderListSelect;
}>;

export const orderPolicySelect = {
  id: true,
  clientUserId: true,
  expertUserId: true,
  status: true,
  payment: { select: { status: true } },
} satisfies Prisma.OrderSelect;

export type OrderPolicyOrder = Prisma.OrderGetPayload<{
  select: typeof orderPolicySelect;
}>;

export const orderStatusResponseSelect = {
  id: true,
  status: true,
  confirmedAt: true,
} satisfies Prisma.OrderSelect;

export type OrderStatusResponseRow = Prisma.OrderGetPayload<{
  select: typeof orderStatusResponseSelect;
}>;

export const pendingOrderForPaySelect = {
  id: true,
  clientUserId: true,
  expertUserId: true,
  status: true,
  agreedServicePrice: true,
  platformFee: true,
  totalAmount: true,
  service: { select: { title: true } },
} satisfies Prisma.OrderSelect;

export type PendingOrderForPay = Prisma.OrderGetPayload<{
  select: typeof pendingOrderForPaySelect;
}>;

export const orderSchedulePolicySelect = {
  id: true,
  clientUserId: true,
  expertUserId: true,
  status: true,
  startDate: true,
  endDate: true,
  payment: { select: { status: true } },
  service: { select: { title: true } },
} satisfies Prisma.OrderSelect;

export type OrderSchedulePolicyOrder = Prisma.OrderGetPayload<{
  select: typeof orderSchedulePolicySelect;
}>;

export const orderCancelRequestPolicySelect = {
  id: true,
  clientUserId: true,
  expertUserId: true,
  status: true,
  payment: {
    select: {
      id: true,
      status: true,
      paidAmount: true,
      paymentKey: true,
      refund: { select: { id: true, status: true } },
    },
  },
  service: { select: { title: true } },
  clientUser: { select: { name: true } },
} satisfies Prisma.OrderSelect;

export type OrderCancelRequestPolicyOrder = Prisma.OrderGetPayload<{
  select: typeof orderCancelRequestPolicySelect;
}>;

export const orderCancelApprovePolicySelect = {
  id: true,
  clientUserId: true,
  expertUserId: true,
  status: true,
  agreedServicePrice: true,
  platformFee: true,
  totalAmount: true,
  payment: {
    select: {
      id: true,
      status: true,
      paymentKey: true,
      paidAmount: true,
      refund: { select: { id: true, type: true, status: true } },
    },
  },
  service: { select: { title: true } },
  clientUser: { select: { name: true } },
} satisfies Prisma.OrderSelect;

export type OrderCancelApprovePolicyOrder = Prisma.OrderGetPayload<{
  select: typeof orderCancelApprovePolicySelect;
}>;

export const orderScheduleChangePolicySelect = {
  id: true,
  clientUserId: true,
  expertUserId: true,
  status: true,
  service: { select: { title: true } },
  clientUser: {
    select: { name: true, clientProfile: { select: { nickname: true } } },
  },
  expertUser: {
    select: { expertProfile: { select: { businessName: true } } },
  },
} satisfies Prisma.OrderSelect;

export type OrderScheduleChangePolicyOrder = Prisma.OrderGetPayload<{
  select: typeof orderScheduleChangePolicySelect;
}>;

export const orderReviewSelect = {
  id: true,
  clientUserId: true,
  expertUserId: true,
  status: true,
  serviceId: true,
  review: {
    select: {
      id: true,
      rating: true,
      content: true,
      createdAt: true,
    },
  },
} satisfies Prisma.OrderSelect;

export type OrderReviewOrder = Prisma.OrderGetPayload<{
  select: typeof orderReviewSelect;
}>;
