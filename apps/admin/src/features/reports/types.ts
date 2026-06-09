import type { ReportReason } from '@/types/enums';

interface ReportUser {
  id: string;
  name: string | null;
  businessName: string | null;
}

export interface ReportItem {
  id: string;
  reason: ReportReason;
  detail: string;
  createdAt: string;
  reporter: ReportUser;
  reported: ReportUser;
}

export interface ReportFilterParams {
  search?: string;
  reason?: ReportReason;
  pageSize?: number;
}
