'use server';

import { api } from '@repo/fetcher';

import { getOrders } from './api';

import type { OrderItem, OrderSortKey, OrderTabKey, ReviewData } from './types';
import type { ApiSuccess, InfiniteScrollPage } from '@/types/api';
import type { Role } from '@/types/enums';

export async function fetchMoreOrders(
  page: number,
  role?: Role,
  tab?: OrderTabKey,
  sort?: OrderSortKey,
  search?: string,
): Promise<InfiniteScrollPage<OrderItem>> {
  const { data } = await getOrders({ page, role, tab, sort, search });
  return { items: data.items, hasNext: data.pagination.hasNext };
}

export async function confirmPurchase(orderId: string): Promise<void> {
  await api.post(`/orders/${orderId}/confirm`, {});
}

export async function requestCancel(orderId: string): Promise<void> {
  await api.post(`/users/me/orders/${orderId}/cancel`, {});
}

export async function requestRefund(orderId: string): Promise<void> {
  await api.post(`/users/me/orders/${orderId}/refund`, {});
}

export async function cancelRefund(orderId: string): Promise<void> {
  await api.post(`/users/me/orders/${orderId}/refund/cancel`, {});
}

export async function requestSettlement(orderId: string): Promise<void> {
  await api.post(`/orders/${orderId}/settlement-request`, {});
}

export async function updateOrderSchedule(
  orderId: string,
  endDate: string,
  roomId?: string,
): Promise<void> {
  await api.patch(`/orders/${orderId}/schedule`, { endDate, roomId });
}

export async function requestScheduleChange(
  orderId: string,
  roomId: string,
): Promise<void> {
  await api.post(`/orders/${orderId}/schedule-change-request`, { roomId });
}

export async function completeWork(orderId: string): Promise<void> {
  await api.patch(`/orders/${orderId}/status`, { status: 'WORK_COMPLETED' });
}

export async function approveRefund(orderId: string): Promise<void> {
  await api.post(`/orders/${orderId}/refund/approve`, {});
}

export async function rejectRefund(orderId: string): Promise<void> {
  await api.post(`/orders/${orderId}/refund/reject`, {});
}

export async function approveCancel(orderId: string): Promise<void> {
  await api.post(`/orders/${orderId}/cancel/approve`, {});
}

export async function rejectCancel(orderId: string): Promise<void> {
  await api.post(`/orders/${orderId}/cancel/reject`, {});
}

export async function submitReview(
  orderId: string,
  rating: number,
  content: string,
): Promise<ReviewData> {
  const response = await api.post<ApiSuccess<ReviewData>>(
    `/orders/${orderId}/reviews`,
    {
      rating,
      content,
    },
  );
  return response.data;
}

export async function updateReview(
  orderId: string,
  reviewId: string,
  rating: number,
  content: string,
): Promise<ReviewData> {
  const response = await api.patch<ApiSuccess<ReviewData>>(
    `/orders/${orderId}/reviews/${reviewId}`,
    { rating, content },
  );
  return response.data;
}

export async function deleteReview(
  orderId: string,
  reviewId: string,
): Promise<void> {
  await api.delete(`/orders/${orderId}/reviews/${reviewId}`);
}
