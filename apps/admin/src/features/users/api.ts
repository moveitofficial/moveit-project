import { api } from '@repo/fetcher';

import type { UserItem } from './types';
import type { ApiSuccess, PaginatedResult } from '@/types/api';
import type {
  ExpertApprovalStatus,
  Provider,
  ServiceType,
} from '@/types/enums';

export interface GetPagedUsersParams {
  tab: 'CLIENT' | 'EXPERT';
  search?: string;
  provider?: Provider;
  region?: string;
  page: number;
  pageSize: number;
  approvalStatus?: ExpertApprovalStatus;
  serviceType?: ServiceType;
}

export async function getUserTabCounts(): Promise<{
  clientCount: number;
  expertCount: number;
}> {
  const res = await api.get<ApiSuccess<{ client: number; expert: number }>>(
    '/admin/users/counts',
  );

  return { clientCount: res.data.client, expertCount: res.data.expert };
}

export function getPagedUsers(
  params: GetPagedUsersParams,
): Promise<ApiSuccess<PaginatedResult<UserItem>>> {
  const query = new URLSearchParams({
    role: params.tab,
    page: String(params.page),
    pageSize: String(params.pageSize),
  });

  if (params.search !== undefined) {
    query.set('search', params.search);
  }
  if (params.provider !== undefined) {
    query.set('provider', params.provider);
  }
  if (params.region !== undefined) {
    query.set('region', params.region);
  }
  if (params.approvalStatus !== undefined) {
    query.set('status', params.approvalStatus);
  }
  if (params.serviceType !== undefined) {
    query.set('specialtyGroup', params.serviceType);
  }

  return api.get<ApiSuccess<PaginatedResult<UserItem>>>(
    `/admin/users?${query.toString()}`,
  );
}
