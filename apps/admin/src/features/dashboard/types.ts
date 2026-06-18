import type { ActivityType } from '@/types/enums';

export interface DashboardSummary {
  expertApplications: number;
  reports: number;
  settlements: number;
  ongoingServices: number;
}

export type PendingTaskType =
  | 'EXPERT_APPLICATION'
  | 'REPORT'
  | 'CS'
  | 'SETTLEMENT';

export interface PendingTask {
  type: PendingTaskType;
  id: string;
  content: string;
  requesterName: string;
  createdAt: string;
}

export interface RecentActivity {
  id: string;
  actionType: ActivityType;
  referenceId: string | null;
  targetName: string | null;
  adminName: string;
  createdAt: string;
}
