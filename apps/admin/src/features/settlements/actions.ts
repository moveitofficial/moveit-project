'use server';

import { getSettlements } from './api';

import type { AdminSettlement } from '@/mocks';
import type { InfiniteScrollPage } from '@/types/api';
import type { SettlementStatus } from '@/types/enums';

import { toScrollPage } from '@/utils/toScrollPage';

export async function fetchMoreSettlements(
  page: number,
  search?: string,
  status?: SettlementStatus,
): Promise<InfiniteScrollPage<AdminSettlement>> {
  return toScrollPage(
    await getSettlements({ page, search, status }),
  );
}
