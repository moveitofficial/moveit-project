import { typography } from '@repo/styles/typography';
import { RoundChip } from '@repo/ui/RoundChip';
import { formatRelativeTime } from '@repo/utils';

import * as styles from './RecentActivityLog.css';

import type { RecentActivity } from '@/features/dashboard/types';

import { ACTIVITY_BADGE_CONFIG } from '@/features/dashboard/constants';

interface Props {
  activities: RecentActivity[];
}

export default function RecentActivityLog({ activities }: Props) {
  return (
    <section className={styles.section}>
      <div className={styles.titleGroup}>
        <h2 className={`${typography.f16EB} ${styles.title}`}>최근 활동</h2>
        <p className={`${typography.f12R} ${styles.subtitle}`}>실시간 로그</p>
      </div>

      <ul className={styles.list}>
        {activities.map((activity, index) => {
          const badge = ACTIVITY_BADGE_CONFIG[activity.type];

          return (
            <li key={index} className={`${typography.f14R} ${styles.item}`}>
              <div className={styles.badgeWrapper}>
                <RoundChip
                  text={badge.text}
                  size="admin"
                  color={badge.color}
                  opacity={badge.opacity}
                />
              </div>

              <span className={styles.message}>{activity.message}</span>

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
      </ul>
    </section>
  );
}
