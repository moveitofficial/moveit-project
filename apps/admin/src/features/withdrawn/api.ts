/**
 * 실제 API 작성 시 수정 예정
 */
import type {
  AdminWithdrawnExpert,
  AdminWithdrawnUser,
  ApiSuccess,
  PaginatedResult,
} from '@/mocks';

import { mockWithdrawnExperts, mockWithdrawnUsers } from '@/mocks';

export interface GetPagedWithdrawnParams {
  tab: 'CLIENT' | 'EXPERT';
  search?: string;
  page: number;
  pageSize: number;
}

export function getWithdrawnTabCounts(): Promise<{
  clientCount: number;
  expertCount: number;
}> {
  return Promise.resolve({
    clientCount: mockWithdrawnUsers.length,
    expertCount: mockWithdrawnExperts.length,
  });
}

export function getPagedWithdrawn(
  params: GetPagedWithdrawnParams,
): Promise<
  ApiSuccess<PaginatedResult<AdminWithdrawnUser | AdminWithdrawnExpert>>
> {
  const baseData: (AdminWithdrawnUser | AdminWithdrawnExpert)[] =
    params.tab === 'CLIENT' ? mockWithdrawnUsers : mockWithdrawnExperts;

  const filtered = baseData.filter((item) => {
    if (params.search === undefined) {
      return true;
    }

    const q = params.search.toLowerCase().trim();
    return item.email.toLowerCase().includes(q);
  });

  const totalCount = filtered.length;
  const startIndex = (params.page - 1) * params.pageSize;
  const pagedItems = filtered.slice(startIndex, startIndex + params.pageSize);

  return Promise.resolve({
    success: true,
    message: '조회 성공',
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
