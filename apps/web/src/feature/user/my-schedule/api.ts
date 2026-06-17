import { api } from '@repo/fetcher';

import type { PaginatedResult } from '@/mocks/types';
import type { ApiSuccess } from '@/types/api';

export type ScheduleStatus =
  | 'IN_PROGRESS'
  | 'WORK_COMPLETED'
  | 'DEADLINE_IMMINENT'
  | 'EXPIRED';

export type ScheduleSort = 'latest' | 'deadline';

export type ScheduleAs = 'client' | 'expert';

// ScheduleCard prop 타입
export interface OrderScheduleItem {
  id: string;
  title: string;
  status: ScheduleStatus;
  amount: number;
  startDate: string;
  endDate: string;
  hasScheduleChangeRequest: boolean;
}

// 목록 API 응답 아이템 (GET /users/me/orders)
export interface ScheduleOrderListItem {
  id: string;
  status: ScheduleStatus;
  hasScheduleChangeRequest: boolean;
  totalAmount: number;
  startDate: string;
  endDate: string | null;
  chatRoomId: string | null;
  service: { title: string };
}

export interface ScheduleTabCounts {
  all: number;
  inProgress: number;
  workCompleted: number;
  deadlineImminent: number;
  expired: number;
}

export interface GetSchedulesParams {
  as: ScheduleAs;
  statuses: ScheduleStatus[];
  sort: ScheduleSort;
  page: number;
  pageSize: number;
}

function buildSchedulesQuery(params: GetSchedulesParams): string {
  const search = new URLSearchParams();
  search.set('as', params.as);
  search.set('sort', params.sort);
  search.set('page', String(params.page));
  search.set('pageSize', String(params.pageSize));
  if (params.statuses.length > 0) {
    search.set('status', params.statuses.join(','));
  }
  return search.toString();
}

export function getSchedules(
  params: GetSchedulesParams,
): Promise<ApiSuccess<PaginatedResult<ScheduleOrderListItem>>> {
  return api.get<ApiSuccess<PaginatedResult<ScheduleOrderListItem>>>(
    `/users/me/orders?${buildSchedulesQuery(params)}`,
  );
}

export function getScheduleCounts(
  as: ScheduleAs,
): Promise<ApiSuccess<ScheduleTabCounts>> {
  return api.get<ApiSuccess<ScheduleTabCounts>>(
    `/users/me/orders/schedule/counts?as=${as}`,
  );
}

export function requestScheduleChange(
  orderId: string,
  roomId?: string,
): Promise<ApiSuccess<unknown>> {
  return api.post<ApiSuccess<unknown>>(
    `/orders/${orderId}/schedule-change-request`,
    roomId === undefined ? {} : { roomId },
  );
}
