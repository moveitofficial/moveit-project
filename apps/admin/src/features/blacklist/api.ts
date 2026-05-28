/**
 * 실제 API 작성 시 수정 예정
 */
import type {
  AdminBlacklistExpert,
  AdminBlacklistUser,
  ApiSuccess,
  PaginatedResult,
} from '@/mocks';

import { mockBlacklistedExperts, mockBlacklistedUsers } from '@/mocks';

export interface GetPagedBlacklistParams {
  tab: 'CLIENT' | 'EXPERT';
  search?: string;
  page: number;
  pageSize: number;
}

export function getBlacklistTabCounts(): Promise<{
  clientCount: number;
  expertCount: number;
}> {
  return Promise.resolve({
    clientCount: mockBlacklistedUsers.length,
    expertCount: mockBlacklistedExperts.length,
  });
}

export function getPagedBlacklist(
  params: GetPagedBlacklistParams,
): Promise<
  ApiSuccess<PaginatedResult<AdminBlacklistUser | AdminBlacklistExpert>>
> {
  const baseData: (AdminBlacklistUser | AdminBlacklistExpert)[] =
    params.tab === 'CLIENT' ? mockBlacklistedUsers : mockBlacklistedExperts;

  const filtered = baseData.filter((item) => {
    if (params.search === undefined) {
      return true;
    }
    
    const q = params.search.toLowerCase().trim();
    return (
      item.name.toLowerCase().includes(q) ||
      item.email.toLowerCase().includes(q) ||
      ('companyName' in item && item.companyName.toLowerCase().includes(q))
    );
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
