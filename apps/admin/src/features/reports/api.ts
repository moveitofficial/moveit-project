import { api } from '@repo/fetcher';

import type { ReportItem } from './types';
import type { ApiSuccess, PaginatedResult } from '@/types/api';
import type { ReportReason } from '@/types/enums';

export interface GetPagedReportsParams {
  search?: string;
  reason?: ReportReason;
  page: number;
  pageSize: number;
}

export function getPagedReports(
  params: GetPagedReportsParams,
): Promise<ApiSuccess<PaginatedResult<ReportItem>>> {
  const query = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
  });
  if (params.search !== undefined) {
    query.set('search', params.search);
  }
  if (params.reason !== undefined) {
    query.set('reason', params.reason);
  }

  return api.get<ApiSuccess<PaginatedResult<ReportItem>>>(
    `/admin/reports?${query.toString()}`,
  );
}
