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

export type ActivityType =
  | 'EXPERT_APPROVED'
  | 'EXPERT_REJECTED'
  | 'MAIN_UPDATED'
  | 'FAQ_CREATED'
  | 'FAQ_UPDATED'
  | 'FAQ_DELETED'
  | 'BLACKLIST_ADDED'
  | 'BLACKLIST_REMOVED'
  | 'REFUND_APPROVED'
  | 'CANCEL_APPROVED'
  | 'CS_ASSIGNED'
  | 'CS_CLOSED'
  | 'SETTLEMENT_COMPLETED';

export interface RecentActivity {
  id: string;
  actionType: ActivityType;
  referenceId: string | null;
  targetName: string | null;
  adminName: string;
  createdAt: string;
}
