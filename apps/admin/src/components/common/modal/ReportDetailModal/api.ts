import { api } from '@repo/fetcher';

import type { UserReportDetail } from './types';
import type { ApiSuccess } from '@/types/api';

export function getUserReportDetail(
  reportId: string,
): Promise<ApiSuccess<UserReportDetail>> {
  return api.get<ApiSuccess<UserReportDetail>>(`/admin/reports/${reportId}`);
}
