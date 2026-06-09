import * as styles from './page.css';

import { DashboardSummaryCards } from '@/features/dashboard/DashboardSummaryCards';
import { PendingTaskTable } from '@/features/dashboard/PendingTaskTable';
import { RecentActivityLog } from '@/features/dashboard/RecentActivityLog';

export default function DashboardPage() {
  return (
    <div className={styles.page}>
      <DashboardSummaryCards />
      <div className={styles.bottomRow}>
        <div className={styles.table}>
          <PendingTaskTable />
        </div>
        <div className={styles.table}>
          <RecentActivityLog />
        </div>
      </div>
    </div>
  );
}
