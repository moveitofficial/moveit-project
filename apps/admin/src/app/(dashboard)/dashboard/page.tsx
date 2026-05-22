import * as styles from './page.css';

import { getDashboard } from '@/features/dashboard/api';
import { DashboardSummaryCards } from '@/features/dashboard/DashboardSummaryCards';
import { PendingTaskTable } from '@/features/dashboard/PendingTaskTable';
import { RecentActivityLog } from '@/features/dashboard/RecentActivityLog';

export default function DashboardPage() {
  const dashboard = getDashboard();

  return (
    <div className={styles.page}>
      <DashboardSummaryCards summary={dashboard.summary} />
      <div className={styles.bottomRow}>
        <div className={styles.pendingCol}>
          <PendingTaskTable tasks={dashboard.pendingTasks} />
        </div>
        <div className={styles.activityCol}>
          <RecentActivityLog activities={dashboard.recentActivities} />
        </div>
      </div>
    </div>
  );
}
