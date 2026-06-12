import { api } from '@repo/fetcher';

import type {
  CommunityDeletionInfo,
  UserCommentItem,
  UserDetailData,
  UserItem,
  UserOrderItem,
  UserPostItem,
  UserReportReceivedItem,
  UserReportSentItem,
  UserServiceItem,
} from './types';
import type { ApiSuccess, PaginatedResult } from '@/types/api';
import type {
  ExpertApprovalStatus,
  Provider,
  ServiceType,
} from '@/types/enums';

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

export async function getUserTabCounts(): Promise<{
  clientCount: number;
  expertCount: number;
}> {
  const res = await api.get<ApiSuccess<{ client: number; expert: number }>>(
    '/admin/users/counts',
  );

  return { clientCount: res.data.client, expertCount: res.data.expert };
}

export function getPagedUsers(
  params: GetPagedUsersParams,
): Promise<ApiSuccess<PaginatedResult<UserItem>>> {
  const query = new URLSearchParams({
    role: params.tab,
    page: String(params.page),
    pageSize: String(params.pageSize),
  });

  if (params.search !== undefined) {
    query.set('search', params.search);
  }
  if (params.provider !== undefined) {
    query.set('provider', params.provider);
  }
  if (params.region !== undefined) {
    query.set('region', params.region);
  }
  if (params.approvalStatus !== undefined) {
    query.set('status', params.approvalStatus);
  }
  if (params.serviceType !== undefined) {
    query.set('specialtyGroup', params.serviceType);
  }

  return api.get<ApiSuccess<PaginatedResult<UserItem>>>(
    `/admin/users?${query.toString()}`,
  );
}

export function getUserDetail(id: string): Promise<ApiSuccess<UserDetailData>> {
  return api.get<ApiSuccess<UserDetailData>>(`/admin/users/${id}`);
}

export function getUserOrders(
  id: string,
  page: number,
): Promise<ApiSuccess<PaginatedResult<UserOrderItem>>> {
  return api.get<ApiSuccess<PaginatedResult<UserOrderItem>>>(
    `/admin/users/${id}/orders?page=${page}`,
  );
}

export function getUserServices(
  id: string,
  page: number,
): Promise<ApiSuccess<PaginatedResult<UserServiceItem>>> {
  return api.get<ApiSuccess<PaginatedResult<UserServiceItem>>>(
    `/admin/users/${id}/services?page=${page}`,
  );
}

export function getUserReportsReceived(
  id: string,
  page: number,
): Promise<ApiSuccess<PaginatedResult<UserReportReceivedItem>>> {
  return api.get<ApiSuccess<PaginatedResult<UserReportReceivedItem>>>(
    `/admin/users/${id}/reports/received?page=${page}`,
  );
}

export function getUserReportsSent(
  id: string,
  page: number,
): Promise<ApiSuccess<PaginatedResult<UserReportSentItem>>> {
  return api.get<ApiSuccess<PaginatedResult<UserReportSentItem>>>(
    `/admin/users/${id}/reports/sent?page=${page}`,
  );
}

export function getUserPosts(
  id: string,
  page: number,
): Promise<ApiSuccess<PaginatedResult<UserPostItem>>> {
  return api.get<ApiSuccess<PaginatedResult<UserPostItem>>>(
    `/admin/users/${id}/posts?page=${page}`,
  );
}

export function getUserComments(
  id: string,
  page: number,
): Promise<ApiSuccess<PaginatedResult<UserCommentItem>>> {
  return api.get<ApiSuccess<PaginatedResult<UserCommentItem>>>(
    `/admin/users/${id}/comments?page=${page}`,
  );
}

export function getPostDeletion(
  postId: string,
): Promise<ApiSuccess<CommunityDeletionInfo>> {
  return api.get<ApiSuccess<CommunityDeletionInfo>>(
    `/admin/community/posts/${postId}/deletion`,
  );
}

export function getCommentDeletion(
  commentId: string,
): Promise<ApiSuccess<CommunityDeletionInfo>> {
  return api.get<ApiSuccess<CommunityDeletionInfo>>(
    `/admin/community/comments/${commentId}/deletion`,
  );
}
