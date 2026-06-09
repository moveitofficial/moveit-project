import { api } from '@repo/fetcher';

import type { AdminDetailInfo, AdminItem, RecentActivity } from './types';
import type { ApiSuccess, PaginatedResult } from '@/types/api';

export interface GetPagedAdminsParams {
  search?: string;
  page: number;
  pageSize: number;
}
export interface CreateAdminParams {
  email: string;
  name: string;
  password: string;
  passwordConfirm: string;
}

interface CreateAdminResult {
  id: string;
  email: string;
  name: string;
  isSuper: boolean;
  mustChangePassword: boolean;
}

export function getPagedAdmins(
  params: GetPagedAdminsParams,
): Promise<ApiSuccess<PaginatedResult<AdminItem>>> {
  const query = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
  });

  if (params.search !== undefined) {
    query.set('search', params.search);
  }

  return api.get<ApiSuccess<PaginatedResult<AdminItem>>>(
    `/admin/accounts?${query.toString()}`,
  );
}

export function getAdminDetail(
  id: string,
): Promise<ApiSuccess<AdminDetailInfo>> {
  return api.get<ApiSuccess<AdminDetailInfo>>(`/admin/accounts/${id}`);
}

export function getAdminActivities(
  id: string,
  page: number,
): Promise<ApiSuccess<PaginatedResult<RecentActivity>>> {
  return api.get<ApiSuccess<PaginatedResult<RecentActivity>>>(
    `/admin/accounts/${id}/activities?page=${page}`,
  );
}

export function createAdmin(
  params: CreateAdminParams,
): Promise<ApiSuccess<CreateAdminResult>> {
  return api.post<ApiSuccess<CreateAdminResult>>('/admin/accounts', params);
}

export function resetAdminPassword(id: string): Promise<ApiSuccess<null>> {
  return api.post<ApiSuccess<null>>(`/admin/accounts/${id}/password-reset`, {});
}
