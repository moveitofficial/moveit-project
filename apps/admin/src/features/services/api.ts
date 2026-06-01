/**
 * 실제 API 작성 시 수정 예정
 */
import type { ServiceFilterParams } from './types';
import type { AdminService, ApiSuccess, PaginatedResult } from '@/mocks';

import { mockAdminServices } from '@/mocks';

export interface GetPagedServicesParams extends ServiceFilterParams {
  page: number;
  pageSize: number;
}

export function getPagedServices(
  params: GetPagedServicesParams,
): Promise<ApiSuccess<PaginatedResult<AdminService>>> {
  const filtered = mockAdminServices.filter((item) => {
    if (params.serviceType !== undefined && item.serviceType !== params.serviceType)
      return false;
    if (params.status !== undefined && item.status !== params.status) return false;
    if (params.search !== undefined) {
      const q = params.search.toLowerCase().trim();
      if (!item.title.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const totalCount = filtered.length;
  const startIndex = (params.page - 1) * params.pageSize;
  const pagedItems = filtered.slice(startIndex, startIndex + params.pageSize);

  return Promise.resolve({
    success: true,
    message: '서비스 목록을 조회했습니다.',
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
