import type { AdminReport, ApiSuccess, PaginatedResult } from '@/mocks';
import type { ReportReason } from '@/types/enums';

import { mockAdminReports } from '@/mocks';

export interface GetPagedReportsParams {
  search?: string;
  reason?: ReportReason;
  page: number;
  pageSize: number;
}

export function getPagedReports(
  params: GetPagedReportsParams,
): Promise<ApiSuccess<PaginatedResult<AdminReport>>> {
  const filtered = mockAdminReports.filter((item) => {
    if (params.reason !== undefined && item.reason !== params.reason) {
      return false;
    }

    if (params.search !== undefined) {
      const q = params.search.toLowerCase().trim();
      return (
        item.reporterName.toLowerCase().includes(q) ||
        item.targetUserName.toLowerCase().includes(q)
      );
    }

    return true;
  });

  const totalCount = filtered.length;
  const startIndex = (params.page - 1) * params.pageSize;
  const pagedItems = filtered.slice(startIndex, startIndex + params.pageSize);

  return Promise.resolve({
    success: true,
    message: '신고 내역을 조회했습니다.',
    data: {
      items: pagedItems,
      pagination: {
        page: params.page,
        pageSize: params.pageSize,
        totalCount,
        hasNext: startIndex + params.pageSize < totalCount,
      },
    },
  });
}
