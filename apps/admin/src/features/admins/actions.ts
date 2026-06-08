'use server';

import { getAdminActivities } from './api';

import type { RecentActivity } from '@/features/admins/types';
import type { InfiniteScrollPage } from '@/types/api';

import { toScrollPage } from '@/utils/toScrollPage';

export async function fetchMoreAdminActivities(
  adminId: string,
  page: number,
): Promise<InfiniteScrollPage<RecentActivity>> {
  return toScrollPage(await getAdminActivities(adminId, page));
}
