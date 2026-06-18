'use server';

import { getDashboardActivities, getDashboardPending } from './api';

import type { PendingTask, RecentActivity } from './types';
import type { InfiniteScrollPage } from '@/types/api';

import { toScrollPage } from '@/utils/toScrollPage';

export async function fetchMorePending(
  page: number,
): Promise<InfiniteScrollPage<PendingTask>> {
  return toScrollPage(await getDashboardPending(page));
}

export async function fetchMoreActivities(
  page: number,
): Promise<InfiniteScrollPage<RecentActivity>> {
  return toScrollPage(await getDashboardActivities(page));
}
