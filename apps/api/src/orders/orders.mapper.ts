import {
  extractPaymentCard,
  extractPaymentReceiptUrl,
} from '../payments/payments.mapper';

import type { OrderListRow, OrderStatusResponseRow } from './orders.types';
import type { Order, Payment } from '@prisma/client';

export function mapCreateOrderResponse(order: Order & { payment: Payment }) {
  return {
    id: order.id,
    status: order.status,
    agreedServicePrice: order.agreedServicePrice,
    platformFee: order.platformFee,
    totalAmount: order.totalAmount,
    startDate: order.startDate,
    endDate: order.endDate,
    createdAt: order.createdAt,
    payment: {
      id: order.payment.id,
      status: order.payment.status,
      method: order.payment.method,
      paidAmount: order.payment.paidAmount,
      installmentMonths: order.payment.installmentMonths,
      paymentKey: order.payment.paymentKey,
      createdAt: order.payment.createdAt,
      approvedAt: order.payment.approvedAt,
      card: extractPaymentCard(order.payment.rawData),
      receiptUrl: extractPaymentReceiptUrl(order.payment.rawData),
    },
  };
}

export function mapUpdateOrderStatusResponse(order: OrderStatusResponseRow) {
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

export function mapOrderListItem(
  order: OrderListRow,
  chatRoomId: string | null,
) {
  return {
    id: order.id,
    status: order.status,
    totalAmount: order.totalAmount,
    agreedServicePrice: order.agreedServicePrice,
    platformFee: order.platformFee,
    startDate: order.startDate,
    endDate: order.endDate,
    createdAt: order.createdAt,
    chatRoomId,
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
    reviewId: order.review?.id ?? null,
  };
}
