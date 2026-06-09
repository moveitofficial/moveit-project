import { api } from '@repo/fetcher';

import type {
  OrderCounts,
  OrderItem,
  OrderSortKey,
  OrderTabKey,
} from './types';
import type { ApiSuccess, PaginatedResult } from '@/types/api';

export interface GetOrdersParams {
  tab?: OrderTabKey;
  sort?: OrderSortKey;
  search?: string;
  page: number;
}

export function getOrders(
  params: GetOrdersParams,
): Promise<ApiSuccess<PaginatedResult<OrderItem>>> {
  const query = new URLSearchParams({ page: String(params.page) });
  
  if (params.tab !== undefined) {
    query.set('tab', params.tab);
  }
  if (params.sort !== undefined) {
    query.set('sort', params.sort);
  }
  if (params.search !== undefined) {
    query.set('search', params.search);
  }

  return api.get<ApiSuccess<PaginatedResult<OrderItem>>>(
    `/admin/orders?${query.toString()}`,
  );
}

export async function getOrderTabCounts(): Promise<OrderCounts> {
  const res = await api.get<ApiSuccess<OrderCounts>>('/admin/orders/counts');
  return res.data;
}
