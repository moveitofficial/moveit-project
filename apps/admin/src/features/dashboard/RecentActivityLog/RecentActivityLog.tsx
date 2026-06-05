import { typography } from '@repo/styles/typography';

import { ActivityInfiniteList } from './ActivityInfiniteList';
import * as styles from './RecentActivityLog.css';

import { getDashboardActivities } from '@/features/dashboard/api';

export default async function RecentActivityLog() {
  const {
    data: { items, pagination },
  } = await getDashboardActivities();
  
  return (
    <section className={styles.section}>
      <div className={styles.titleGroup}>
        <h2 className={`${typography.f16EB} ${styles.title}`}>최근 활동</h2>
        <p className={`${typography.f12R} ${styles.subtitle}`}>실시간 로그</p>
      </div>

      <ActivityInfiniteList
        initialItems={items}
        initialHasNext={pagination.hasNext}
      />
    </section>
  );
}
