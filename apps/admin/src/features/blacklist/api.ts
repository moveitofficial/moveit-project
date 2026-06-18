import { api } from '@repo/fetcher';

import type { BlacklistItem } from './types';
import type { ApiSuccess, PaginatedResult } from '@/types/api';

export interface GetPagedBlacklistParams {
  tab: 'CLIENT' | 'EXPERT';
  search?: string;
  page: number;
  pageSize: number;
}

export async function getBlacklistTabCounts(): Promise<{
  clientCount: number;
  expertCount: number;
}> {
  const res = await api.get<ApiSuccess<{ client: number; expert: number }>>(
    '/admin/users/blacklist/counts',
  );
  return { clientCount: res.data.client, expertCount: res.data.expert };
}

export function getPagedBlacklist(
  params: GetPagedBlacklistParams,
): Promise<ApiSuccess<PaginatedResult<BlacklistItem>>> {
  const query = new URLSearchParams({
    role: params.tab,
    page: String(params.page),
    pageSize: String(params.pageSize),
  });

  if (params.search !== undefined) {
    query.set('search', params.search);
  }

  return api.get<ApiSuccess<PaginatedResult<BlacklistItem>>>(
    `/admin/users/blacklist?${query.toString()}`,
  );
}
