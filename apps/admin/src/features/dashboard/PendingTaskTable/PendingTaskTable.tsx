import { typography } from '@repo/styles/typography';

import { PendingTaskInfiniteList } from './PendingTaskInfiniteList';
import * as styles from './PendingTaskTable.css';

import { getDashboardPending } from '@/features/dashboard/api';

export default async function PendingTaskTable() {
  const {
    data: { items, pagination },
  } = await getDashboardPending();
  
  return (
    <section className={styles.section}>
      <div className={styles.titleGroup}>
        <h2 className={`${typography.f16EB} ${styles.title}`}>처리대기</h2>
        <p className={`${typography.f12R} ${styles.subtitle}`}>
          확인이 필요한 항목
        </p>
      </div>

      <div className={styles.listWrapper}>
        <div className={`${typography.f16EB} ${styles.listHeader}`}>
          <span className={styles.colBadge}>구분</span>
          <span className={styles.colTitleHeader}>내용</span>
          <span className={styles.colRequester}>요청자</span>
          <span className={styles.colDate}>시간</span>
        </div>

        <div className={styles.listScroll}>
          <PendingTaskInfiniteList
            initialItems={items}
            initialHasNext={pagination.hasNext}
          />
        </div>
      </div>
    </section>
  );
}
