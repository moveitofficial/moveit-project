'use client';

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  getScheduleCounts,
  getSchedules,
  requestScheduleChange,
  type ScheduleAs,
  type ScheduleOrderListItem,
  type ScheduleSort,
  type ScheduleStatus,
} from './api';
import { SCHEDULE_PAGE_SIZE } from './constants';

export const SCHEDULES_QUERY_KEY = ['users', 'me', 'orders', 'schedule'] as const;

export function useSchedulesInfinite(
  as: ScheduleAs,
  statuses: ScheduleStatus[],
  sort: ScheduleSort,
) {
  return useInfiniteQuery({
    queryKey: [...SCHEDULES_QUERY_KEY, 'list', as, [...statuses].sort(), sort],
    queryFn: ({ pageParam }) =>
      getSchedules({ as, statuses, sort, page: pageParam, pageSize: SCHEDULE_PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.data.pagination.hasNext ? allPages.length + 1 : undefined,
  });
}

export function useScheduleCounts(as: ScheduleAs) {
  return useQuery({
    queryKey: [...SCHEDULES_QUERY_KEY, 'counts', as],
    queryFn: async () => {
      const response = await getScheduleCounts(as);
      return response.data;
    },
  });
}

export function useRequestScheduleChangeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, roomId }: { orderId: string; roomId?: string }) =>
      requestScheduleChange(orderId, roomId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: SCHEDULES_QUERY_KEY });
    },
  });
}

export function flattenSchedulePages(
  pages: { data: { items: ScheduleOrderListItem[] } }[] | undefined,
): ScheduleOrderListItem[] {
  return pages?.flatMap((page) => page.data.items) ?? [];
}
