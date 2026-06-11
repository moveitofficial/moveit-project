import { api } from '@repo/fetcher';

import type {
  CommunityDeletionInfo,
  OrderRefundDetail,
  OrderSettlement,
  OrderSettlementPreview,
  OrderTransaction,
  ServiceOrderCounts,
  ServiceOrderSort,
  ServiceOrderTab,
  ServiceOrdersResult,
  UserCommentItem,
  UserDetailData,
  UserItem,
  UserOrderItem,
  UserPostItem,
  UserReportDetail,
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

export function getUserReportDetail(
  reportId: string,
): Promise<ApiSuccess<UserReportDetail>> {
  return api.get<ApiSuccess<UserReportDetail>>(`/admin/reports/${reportId}`);
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

export function getOrderTransaction(
  orderId: string,
): Promise<ApiSuccess<OrderTransaction>> {
  return api.get<ApiSuccess<OrderTransaction>>(
    `/admin/orders/${orderId}/transaction`,
  );
}

export function getOrderRefund(
  orderId: string,
): Promise<ApiSuccess<OrderRefundDetail>> {
  return api.get<ApiSuccess<OrderRefundDetail>>(
    `/admin/orders/${orderId}/refund`,
  );
}

export interface GetServiceOrdersParams {
  tab?: ServiceOrderTab;
  sort?: ServiceOrderSort;
  search?: string;
  page: number;
}

export function getServiceOrders(
  serviceId: string,
  params: GetServiceOrdersParams,
): Promise<ApiSuccess<ServiceOrdersResult>> {
  const query = new URLSearchParams({ page: String(params.page) });

  if (params.tab !== undefined && params.tab !== 'all') {
    query.set('tab', params.tab);
  }
  if (params.sort !== undefined && params.sort !== 'latest') {
    query.set('sort', params.sort);
  }
  if (params.search !== undefined && params.search !== '') {
    query.set('search', params.search);
  }

  return api.get<ApiSuccess<ServiceOrdersResult>>(
    `/admin/services/${serviceId}/orders?${query.toString()}`,
  );
}

export function getServiceOrderCounts(
  serviceId: string,
): Promise<ApiSuccess<ServiceOrderCounts>> {
  return api.get<ApiSuccess<ServiceOrderCounts>>(
    `/admin/services/${serviceId}/orders/counts`,
  );
}

export function getOrderSettlement(
  orderId: string,
): Promise<ApiSuccess<OrderSettlement>> {
  return api.get<ApiSuccess<OrderSettlement>>(
    `/admin/orders/${orderId}/settlement`,
  );
}

export function getOrderSettlementPreview(
  orderId: string,
): Promise<ApiSuccess<OrderSettlementPreview>> {
  return api.get<ApiSuccess<OrderSettlementPreview>>(
    `/admin/orders/${orderId}/settlement/preview`,
  );
}
