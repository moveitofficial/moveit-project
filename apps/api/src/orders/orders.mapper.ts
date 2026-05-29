import type { OrderDetailRow, OrderListRow } from './orders.types';

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

export function mapOrderDetail(order: OrderDetailRow) {
  return {
    id: order.id,
    status: order.status,
    totalAmount: order.totalAmount,
    agreedServicePrice: order.agreedServicePrice,
    platformFee: order.platformFee,
    refundReason: order.refundReason,
    startDate: order.startDate,
    endDate: order.endDate,
    createdAt: order.createdAt,
    confirmedAt: order.confirmedAt,
    settledAt: order.settledAt,
    service: order.service,
    payment: order.payment,
  };
}

export type OrderDetailResponse = ReturnType<typeof mapOrderDetail>;
