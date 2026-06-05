'use client';

import { typography } from '@repo/styles/typography';
import { RoundChip } from '@repo/ui/RoundChip';
import { formatRelativeTime } from '@repo/utils';

import * as styles from './PendingTaskTable.css';

import type { PendingTask } from '@/features/dashboard/types';

import { fetchMorePending } from '@/features/dashboard/actions';
import { PENDING_TASK_BADGE_CONFIG } from '@/features/dashboard/constants';
import { useInfiniteScroll } from '@/utils/hooks';

interface Props {
  initialItems: PendingTask[];
  initialHasNext: boolean;
}

export function PendingTaskInfiniteList({
  initialItems,
  initialHasNext,
}: Props) {
  const { items, hasNext, isLoading, sentinelRef } = useInfiniteScroll(
    initialItems,
    initialHasNext,
    fetchMorePending,
  );

  return (
    <ul className={styles.list}>
      {items.map((task) => {
        const badge = PENDING_TASK_BADGE_CONFIG[task.type];
        return (
          <li key={task.id} className={`${typography.f14R} ${styles.listItem}`}>
            <div className={styles.colBadge}>
              <RoundChip
                text={badge.text}
                size="admin"
                color={badge.color}
                opacity={badge.opacity}
              />
            </div>
            <span className={styles.colTitle} title={task.content}>
              {task.content}
            </span>
            <span className={styles.colRequester}>{task.requesterName}</span>
            <span className={styles.colDate}>
              {formatRelativeTime(task.createdAt)}
            </span>
          </li>
        );
      })}
      {hasNext && <li ref={sentinelRef} />}
      {isLoading && (
        <li className={`${typography.f12R} ${styles.loadingRow}`}>
          불러오는 중...
        </li>
      )}
    </ul>
  );
}
