import { api } from '@repo/fetcher';

import type { DashboardSummary, PendingTask, RecentActivity } from './types';
import type { ApiSuccess, PaginatedResult } from '@/types/api';

export function getDashboardSummary(): Promise<ApiSuccess<DashboardSummary>> {
  return api.get<ApiSuccess<DashboardSummary>>('/admin/dashboard/summary');
}

export function getDashboardPending(
  page = 1,
): Promise<ApiSuccess<PaginatedResult<PendingTask>>> {
  return api.get<ApiSuccess<PaginatedResult<PendingTask>>>(
    `/admin/dashboard/pending?page=${page}`,
  );
}

export function getDashboardActivities(
  page = 1,
): Promise<ApiSuccess<PaginatedResult<RecentActivity>>> {
  return api.get<ApiSuccess<PaginatedResult<RecentActivity>>>(
    `/admin/dashboard/activities?page=${page}`,
  );
}
