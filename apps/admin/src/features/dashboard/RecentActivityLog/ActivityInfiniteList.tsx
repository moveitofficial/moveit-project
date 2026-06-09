'use client';

import { typography } from '@repo/styles/typography';
import { RoundChip } from '@repo/ui/RoundChip';
import { formatRelativeTime } from '@repo/utils';

import * as styles from './RecentActivityLog.css';

import type { RecentActivity } from '@/features/dashboard/types';

import { fetchMoreActivities } from '@/features/dashboard/actions';
import { ACTIVITY_BADGE_CONFIG } from '@/utils/constants/activityConstants';
import { formatActivityMessage } from '@/utils/formatActivityMessage';
import { useInfiniteScroll } from '@/utils/hooks';

interface Props {
  initialItems: RecentActivity[];
  initialHasNext: boolean;
}

export function ActivityInfiniteList({ initialItems, initialHasNext }: Props) {
  const { items, hasNext, isLoading, sentinelRef } = useInfiniteScroll(
    initialItems,
    initialHasNext,
    fetchMoreActivities,
  );

  return (
    <ul className={styles.list}>
      {items.map((activity) => {
        const badge = ACTIVITY_BADGE_CONFIG[activity.actionType];
        const message = formatActivityMessage(activity);

        return (
          <li key={activity.id} className={`${typography.f14R} ${styles.item}`}>
            <div className={styles.badgeWrapper}>
              <RoundChip
                text={badge.text}
                size="admin"
                color={badge.color}
                opacity={badge.opacity}
              />
            </div>
            <span className={styles.message} title={message}>
              {message}
            </span>
            <div className={styles.metaGroup}>
              <span className={`${typography.f12B} ${styles.adminName}`}>
                {activity.adminName}
              </span>
              <span className={`${typography.f12R} ${styles.date}`}>
                {formatRelativeTime(activity.createdAt)}
              </span>
            </div>
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
