/**
 * 실제 API 작성 시 수정 예정
 */
import type { AdminManager, ApiSuccess, PaginatedResult } from '@/mocks';

import { mockAdminManagers } from '@/mocks';

export interface GetPagedManagersParams {
  search?: string;
  page: number;
  pageSize: number;
}

export function getPagedManagers(
  params: GetPagedManagersParams,
): Promise<ApiSuccess<PaginatedResult<AdminManager>>> {
  const filtered = mockAdminManagers.filter((item) => {
    if (params.search === undefined) return true;

    const q = params.search.toLowerCase().trim();
    return (
      item.name.toLowerCase().includes(q) ||
      item.email.toLowerCase().includes(q)
    );
  });

  const totalCount = filtered.length;
  const startIndex = (params.page - 1) * params.pageSize;
  const pagedItems = filtered.slice(startIndex, startIndex + params.pageSize);

  return Promise.resolve({
    success: true,
    message: '관리자 목록을 조회했습니다.',
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
