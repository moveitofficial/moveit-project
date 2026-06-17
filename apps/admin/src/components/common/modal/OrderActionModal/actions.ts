'use server';

import { api } from '@repo/fetcher';

export async function completeOrderSettlement(orderId: string): Promise<void> {
  await api.patch(`/admin/orders/${orderId}/settlement`, {});
}

export async function approveCancel(
  orderId: string,
  reason: string,
): Promise<void> {
  await api.patch(`/admin/orders/${orderId}/cancel/approve`, { reason });
}

export async function approveRefund(
  orderId: string,
  reason: string,
): Promise<void> {
  await api.patch(`/admin/orders/${orderId}/refund/approve`, { reason });
}
