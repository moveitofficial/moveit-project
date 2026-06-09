'use server';

import { getOrders } from './api';

import type { OrderItem, OrderSortKey, OrderTabKey } from './types';
import type { InfiniteScrollPage } from '@/types/api';

import { toScrollPage } from '@/utils/toScrollPage';

export async function fetchMoreOrders(
  page: number,
  tab?: OrderTabKey,
  sort?: OrderSortKey,
  search?: string,
): Promise<InfiniteScrollPage<OrderItem>> {
  return toScrollPage(await getOrders({ page, tab, sort, search }));
}
