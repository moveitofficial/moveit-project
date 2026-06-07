import { api } from '@repo/fetcher';

import type { WithdrawnItem } from './types';
import type { ApiSuccess, PaginatedResult } from '@/types/api';

export interface GetPagedWithdrawnParams {
  tab: 'CLIENT' | 'EXPERT';
  search?: string;
  page: number;
  pageSize: number;
}

export async function getWithdrawnTabCounts(): Promise<{
  clientCount: number;
  expertCount: number;
}> {
  const res = await api.get<ApiSuccess<{ client: number; expert: number }>>(
    '/admin/users/withdrawn/counts',
  );
  return { clientCount: res.data.client, expertCount: res.data.expert };
}

export function getPagedWithdrawn(
  params: GetPagedWithdrawnParams,
): Promise<ApiSuccess<PaginatedResult<WithdrawnItem>>> {
  const query = new URLSearchParams({
    role: params.tab,
    page: String(params.page),
    pageSize: String(params.pageSize),
  });

  if (params.search !== undefined) {
    query.set('search', params.search);
  }

  return api.get<ApiSuccess<PaginatedResult<WithdrawnItem>>>(
    `/admin/users/withdrawn?${query.toString()}`,
  );
}
