import type { OrderListRow } from './orders.types';
import type { Order } from '@prisma/client';

export function mapCreateOrderResponse(order: Order) {
  return {
    id: order.id,
    status: order.status,
    agreedServicePrice: order.agreedServicePrice,
    platformFee: order.platformFee,
    totalAmount: order.totalAmount,
    startDate: order.startDate,
    endDate: order.endDate,
    createdAt: order.createdAt,
  };
}

export function mapUpdateOrderStatusResponse(order: Order) {
  return {
    id: order.id,
    status: order.status,
    confirmedAt: order.confirmedAt,
  };
}

export function mapUpdateOrderScheduleResponse(order: Order) {
  return {
    id: order.id,
    status: order.status,
    endDate: order.endDate,
  };
}

export function mapOrderListItem(order: OrderListRow) {
  return {
    id: order.id,
    status: order.status,
    totalAmount: order.totalAmount,
    agreedServicePrice: order.agreedServicePrice,
    platformFee: order.platformFee,
    startDate: order.startDate,
    endDate: order.endDate,
    createdAt: order.createdAt,
    service: {
      id: order.service.id,
      title: order.service.title,
      images: order.service.images,
    },
    clientUser: order.clientUser,
    expertUser: {
      id: order.expertUser.id,
      businessName: order.expertUser.expertProfile?.businessName ?? null,
      profileImageUrl: order.expertUser.profileImageUrl,
    },
  };
}
