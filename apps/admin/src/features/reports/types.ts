import type { ReportReason } from '@/types/enums';

export interface ReportFilterParams {
  search?: string;
  reason?: ReportReason;
  pageSize?: number;
}
