'use server';

import { api } from '@repo/fetcher';

export async function completeOrderSettlement(orderId: string): Promise<void> {
  await api.patch(`/admin/orders/${orderId}/settlement`, {});
}
