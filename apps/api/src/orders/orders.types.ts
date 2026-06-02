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
} satisfies Prisma.OrderSelect;

export type OrderPolicyOrder = Prisma.OrderGetPayload<{
  select: typeof orderPolicySelect;
}>;

export const orderSchedulePolicySelect = {
  id: true,
  clientUserId: true,
  expertUserId: true,
  status: true,
  endDate: true,
} satisfies Prisma.OrderSelect;

export type OrderSchedulePolicyOrder = Prisma.OrderGetPayload<{
  select: typeof orderSchedulePolicySelect;
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
