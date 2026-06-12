import type { ReportReason } from '@/types/enums';

export interface UserReportDetail {
  id: string;
  reason: ReportReason;
  detail: string;
  images: string[];
}
