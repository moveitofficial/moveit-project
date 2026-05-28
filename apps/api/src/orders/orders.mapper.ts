import type { OrderDetailRow } from './orders.types';

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
