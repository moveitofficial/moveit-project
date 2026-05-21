import { typography } from '@repo/styles/typography';
import { RoundChip } from '@repo/ui/RoundChip';
import { formatRelativeTime } from '@repo/utils';

import * as styles from './PendingTaskTable.css';

import type { PendingTask } from '@/features/dashboard/types';

import { PENDING_TASK_BADGE_CONFIG } from '@/features/dashboard/constants';

interface Props {
  tasks: PendingTask[];
}

export default function PendingTaskTable({ tasks }: Props) {
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

        <ul className={styles.list}>
          {tasks.map((task, index) => {
            const badge = PENDING_TASK_BADGE_CONFIG[task.type];

            return (
              <li
                key={index}
                className={`${typography.f14R} ${styles.listItem}`}
              >
                <div className={styles.colBadge}>
                  <RoundChip
                    text={badge.text}
                    size="admin"
                    color={badge.color}
                    opacity={badge.opacity}
                  />
                </div>

                <span className={styles.colTitle} title={task.title}>
                  {task.title}
                </span>
                <span className={styles.colRequester}>{task.requester}</span>
                <span className={styles.colDate}>
                  {formatRelativeTime(task.createdAt)}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
