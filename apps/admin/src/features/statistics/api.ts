import { api } from '@repo/fetcher';

import type { SalesStatistics } from './types';
import type { ApiSuccess } from '@/types/api';

export interface GetSalesStatisticsParams {
  startDate: string;
  endDate: string;
}

export function getSalesStatistics(
  params: GetSalesStatisticsParams,
): Promise<ApiSuccess<SalesStatistics>> {
  const query = new URLSearchParams({
    startDate: params.startDate,
    endDate: params.endDate,
  });

  return api.get<ApiSuccess<SalesStatistics>>(
    `/admin/statistics?${query.toString()}`,
  );
}
