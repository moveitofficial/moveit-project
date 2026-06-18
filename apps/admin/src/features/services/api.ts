import { api } from '@repo/fetcher';

import type { ServiceFilterParams, ServiceItem } from './types';
import type { ApiSuccess, PaginatedResult } from '@/types/api';

export interface GetPagedServicesParams extends ServiceFilterParams {
  page: number;
  pageSize: number;
}

export function getPagedServices(
  params: GetPagedServicesParams,
): Promise<ApiSuccess<PaginatedResult<ServiceItem>>> {
  const query = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
  });
  if (params.search !== undefined) {
    query.set('search', params.search);
  }
  if (params.categoryGroup !== undefined) {
    query.set('categoryGroup', params.categoryGroup);
  }
  if (params.status !== undefined) {
    query.set('status', params.status);
  }

  return api.get<ApiSuccess<PaginatedResult<ServiceItem>>>(
    `/admin/services?${query.toString()}`,
  );
}
