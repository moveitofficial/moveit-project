import { typography } from '@repo/styles/typography';

import * as styles from './DashboardSummaryCards.css';

import type { DashboardSummary } from '@/features/dashboard/types';

import { getDashboardSummary } from '@/features/dashboard/api';
import { SUMMARY_CARD_CONFIG } from '@/features/dashboard/constants';

export default async function DashboardSummaryCards() {
  const { data: summary } = await getDashboardSummary();
  const cardList = Object.entries(SUMMARY_CARD_CONFIG) as [
    keyof DashboardSummary,
    (typeof SUMMARY_CARD_CONFIG)[keyof DashboardSummary],
  ][];

  return (
    <div className={styles.grid}>
      {cardList.map(([key, config]) => (
        <div key={key} className={styles.card}>
          <p className={`${typography.f14B} ${styles.label}`}>{config.label}</p>

          <p className={styles.countRow}>
            <span
              className={`${typography.f32EB} ${styles.countColor[config.countColor]}`}
            >
              {summary[key]}
            </span>
            <span className={`${typography.f12R} ${styles.countUnit}`}>건</span>
          </p>

          <p className={`${typography.f12R} ${styles.subtext}`}>
            {config.subtext}
          </p>
        </div>
      ))}
    </div>
  );
}
