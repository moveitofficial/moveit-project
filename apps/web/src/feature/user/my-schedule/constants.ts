import type { ScheduleSort, ScheduleStatus } from './api';

export type ScheduleFilter =
  | 'ALL'
  | 'IN_PROGRESS'
  | 'WORK_COMPLETED'
  | 'DEADLINE_IMMINENT'
  | 'EXPIRED';

export type ScheduleCountKey =
  | 'all'
  | 'inProgress'
  | 'workCompleted'
  | 'deadlineImminent'
  | 'expired';

// 일정관리에 노출되는 주문 상태 (전체 탭)
export const SCHEDULE_STATUSES: ScheduleStatus[] = [
  'IN_PROGRESS',
  'WORK_COMPLETED',
  'DEADLINE_IMMINENT',
  'EXPIRED',
];

interface ScheduleFilterOption {
  key: ScheduleFilter;
  label: string;
  statuses: ScheduleStatus[];
  countKey: ScheduleCountKey;
}

export const SCHEDULE_FILTERS: ScheduleFilterOption[] = [
  { key: 'ALL', label: '전체', statuses: SCHEDULE_STATUSES, countKey: 'all' },
  {
    key: 'IN_PROGRESS',
    label: '작업중',
    statuses: ['IN_PROGRESS'],
    countKey: 'inProgress',
  },
  {
    key: 'WORK_COMPLETED',
    label: '완료',
    statuses: ['WORK_COMPLETED'],
    countKey: 'workCompleted',
  },
  {
    key: 'DEADLINE_IMMINENT',
    label: '마감 임박',
    statuses: ['DEADLINE_IMMINENT'],
    countKey: 'deadlineImminent',
  },
  {
    key: 'EXPIRED',
    label: '기한만료',
    statuses: ['EXPIRED'],
    countKey: 'expired',
  },
];

export const SCHEDULE_SORT_OPTIONS: { key: ScheduleSort; label: string }[] = [
  { key: 'latest', label: '최신순' },
  { key: 'deadline', label: '마감일 순' },
];

export const SCHEDULE_PAGE_SIZE = 10;
