import type { AdminDashboard } from '@/mocks/types';

export type DashboardSummary = AdminDashboard['summary'];
export type PendingTask = AdminDashboard['pendingTasks'][number];
export type RecentActivity = AdminDashboard['recentActivities'][number];
