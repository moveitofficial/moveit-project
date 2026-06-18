import { api } from '@repo/fetcher';

import type {
  ServiceOrderCounts,
  ServiceOrderSort,
  ServiceOrderTab,
  ServiceOrdersResult,
} from './types';
import type { ApiSuccess } from '@/types/api';

export interface GetServiceOrdersParams {
  tab?: ServiceOrderTab;
  sort?: ServiceOrderSort;
  search?: string;
  page: number;
}

export function getServiceOrders(
  serviceId: string,
  params: GetServiceOrdersParams,
): Promise<ApiSuccess<ServiceOrdersResult>> {
  const query = new URLSearchParams({ page: String(params.page) });

  if (params.tab !== undefined && params.tab !== 'all') {
    query.set('tab', params.tab);
  }
  if (params.sort !== undefined && params.sort !== 'latest') {
    query.set('sort', params.sort);
  }
  if (params.search !== undefined && params.search !== '') {
    query.set('search', params.search);
  }

  return api.get<ApiSuccess<ServiceOrdersResult>>(
    `/admin/services/${serviceId}/orders?${query.toString()}`,
  );
}

export function getServiceOrderCounts(
  serviceId: string,
): Promise<ApiSuccess<ServiceOrderCounts>> {
  return api.get<ApiSuccess<ServiceOrderCounts>>(
    `/admin/services/${serviceId}/orders/counts`,
  );
}
