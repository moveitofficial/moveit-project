import type { ActivityType } from '@/types/enums';

export interface AdminItem {
  id: string;
  name: string;
  email: string;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface AdminFilterParams {
  search?: string;
  pageSize?: number;
}

export interface AdminDetailInfo {
  id: string;
  email: string;
  name: string;
}

export interface RecentActivity {
  id: string;
  actionType: ActivityType;
  referenceId: string | null;
  targetName: string | null;
  adminName: string;
  createdAt: string;
}
