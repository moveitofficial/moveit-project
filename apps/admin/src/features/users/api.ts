/**
 * 실제 API 작성 시 수정 예정
 */
import type {
  AdminExpert,
  AdminUser,
  ApiSuccess,
  ExpertApprovalStatus,
  PaginatedResult,
  Provider,
  ServiceType,
} from '@/mocks';

import { mockAdminExperts, mockAdminUsers } from '@/mocks';

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

export function getUserTabCounts(): Promise<{
  clientCount: number;
  expertCount: number;
}> {
  return Promise.resolve({
    clientCount: mockAdminUsers.length,
    expertCount: mockAdminExperts.length,
  });
}

export function getPagedUsers(
  params: GetPagedUsersParams,
): Promise<ApiSuccess<PaginatedResult<AdminUser | AdminExpert>>> {
  const baseData: (AdminUser | AdminExpert)[] =
    params.tab === 'CLIENT' ? mockAdminUsers : mockAdminExperts;

  const approvalStatus =
    params.tab === 'EXPERT' ? params.approvalStatus : undefined;
  const serviceType = params.tab === 'EXPERT' ? params.serviceType : undefined;

  const filteredData = baseData
    .filter((user) => {
      if (params.search === undefined) return true;
      const query = params.search.toLowerCase().trim();
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        ('companyName' in user &&
          user.companyName.toLowerCase().includes(query))
      );
    })
    .filter(
      (user) =>
        params.provider === undefined || user.provider === params.provider,
    )
    .filter(
      (user) => params.region === undefined || user.region === params.region,
    )
    .filter(
      (user) =>
        approvalStatus === undefined ||
        ('approvalStatus' in user && user.approvalStatus === approvalStatus),
    )
    .filter(
      (user) =>
        serviceType === undefined ||
        ('serviceType' in user && user.serviceType === serviceType),
    );

  const totalCount = filteredData.length;
  const startIndex = (params.page - 1) * params.pageSize;
  const pagedItems = filteredData.slice(
    startIndex,
    startIndex + params.pageSize,
  );

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
