/**
 * 실제 API 작성 시 수정 예정
 */
import type { AdminSettlement, ApiSuccess, PaginatedResult } from '@/mocks';
import type { SettlementStatus } from '@/types/enums';

import { mockAdminSettlements } from '@/mocks';

const PAGE_SIZE = 10;

export interface GetSettlementsParams {
  search?: string;
  status?: SettlementStatus;
  page: number;
}

export function getSettlements(
  params: GetSettlementsParams,
): Promise<ApiSuccess<PaginatedResult<AdminSettlement>>> {
  const filtered = mockAdminSettlements.filter((item) => {
    if (params.status !== undefined && item.status !== params.status) {
      return false;
    }

    if (params.search !== undefined) {
      const q = params.search.toLowerCase().trim();
      return item.clientName.toLowerCase().includes(q);
    }

    return true;
  });

  const totalCount = filtered.length;
  const startIndex = (params.page - 1) * PAGE_SIZE;
  const pagedItems = filtered.slice(startIndex, startIndex + PAGE_SIZE);

  return Promise.resolve({
    success: true,
    message: '정산 목록을 조회했습니다.',
    data: {
      items: pagedItems,
      pagination: {
        page: params.page,
        pageSize: PAGE_SIZE,
        totalCount,
        hasNext: startIndex + PAGE_SIZE < totalCount,
      },
    },
  });
}
