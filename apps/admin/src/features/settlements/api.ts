import { api } from '@repo/fetcher';

import type { SettlementItem } from './types';
import type { ApiSuccess, PaginatedResult } from '@/types/api';
import type { SettlementStatus } from '@/types/enums';

export interface GetSettlementsParams {
  search?: string;
  status?: SettlementStatus;
  page: number;
}

export function getSettlements(
  params: GetSettlementsParams,
): Promise<ApiSuccess<PaginatedResult<SettlementItem>>> {
  const query = new URLSearchParams({ page: String(params.page) });

  if (params.status !== undefined) {
    query.set('status', params.status);
  }
  if (params.search !== undefined) {
    query.set('search', params.search);
  }

  return api.get<ApiSuccess<PaginatedResult<SettlementItem>>>(
    `/admin/orders/settlements?${query.toString()}`,
  );
}
