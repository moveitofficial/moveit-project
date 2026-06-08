'use client';

import { typography } from '@repo/styles/typography';
import { RoundChip } from '@repo/ui/RoundChip';
import { formatRelativeTime } from '@repo/utils';

import * as styles from './AdminActivityList.css';

import type { RecentActivity } from '@/features/admins/types';
import type { InfiniteScrollPage } from '@/types/api';

import { fetchMoreAdminActivities } from '@/features/admins/actions';
import { ACTIVITY_BADGE_CONFIG } from '@/utils/constants/activityConstants';
import { formatActivityMessage } from '@/utils/formatActivityMessage';
import { useInfiniteScroll } from '@/utils/hooks';

interface Props {
  adminId: string;
  initialItems: RecentActivity[];
  initialHasNext: boolean;
}

export default function AdminActivityInfiniteList({
  adminId,
  initialItems,
  initialHasNext,
}: Props) {
  const fetchMore = (
    page: number,
  ): Promise<InfiniteScrollPage<RecentActivity>> =>
    fetchMoreAdminActivities(adminId, page);

  const { items, hasNext, isLoading, sentinelRef } = useInfiniteScroll(
    initialItems,
    initialHasNext,
    fetchMore,
  );

  if (items.length === 0 && !isLoading) {
    return (
      <p className={`${typography.f14R} ${styles.emptyMessage}`}>
        활동 내역이 없습니다.
      </p>
    );
  }

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
