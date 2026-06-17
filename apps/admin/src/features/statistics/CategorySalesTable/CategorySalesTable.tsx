'use client';

import { typography } from '@repo/styles/typography';
import { useState } from 'react';

import * as styles from './CategorySalesTable.css';

import type { CategorySalesItem } from '@/features/statistics/types';
import type { ServiceType } from '@/types/enums';

import { SERVICE_CATEGORY_LABEL, SERVICE_TYPE_LABEL } from '@/utils/constants';
import { toManwon } from '@/utils/formatCurrency';
import { calcDayCount, formatDisplayDate } from '@/utils/formatDate';

interface Props {
  data: CategorySalesItem[];
  startDate: string;
  endDate: string;
}

const TABS: { label: string; value: ServiceType }[] = [
  { label: 'IT 코칭', value: 'IT_COACHING' },
  { label: '프로젝트 의뢰', value: 'PROJECT_REQUEST' },
];

export default function CategorySalesTable({
  data,
  startDate,
  endDate,
}: Props) {
  const [activeTab, setActiveTab] = useState<ServiceType>('IT_COACHING');

  const filtered = data.filter((item) => item.serviceGroupName === activeTab);
  const subtitle = `${formatDisplayDate(startDate)} ~ ${formatDisplayDate(endDate)} ${calcDayCount(startDate, endDate)}일`;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <p className={`${typography.f16EB} ${styles.headerTitle}`}>
            카테고리별 매출
          </p>
          <p className={`${typography.f12R} ${styles.headerSubtitle}`}>
            {subtitle}
          </p>
        </div>
        <div className={styles.tabs}>
          {TABS.map((tab) => {
            const active = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => {
                  setActiveTab(tab.value);
                }}
                className={`${active ? typography.f16EB : typography.f16R} ${styles.tab[active ? 'active' : 'inactive']}`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <p className={typography.f16R}>데이터가 없습니다.</p>
        </div>
      ) : (
        <ul className={styles.list}>
          {filtered.map((item) => (
            <li key={item.serviceCategoryName} className={styles.row}>
              <div className={styles.rowLeft}>
                <span className={`${typography.f16B} ${styles.rowName}`}>
                  {SERVICE_TYPE_LABEL[item.serviceGroupName]} ·{' '}
                  {SERVICE_CATEGORY_LABEL[item.serviceCategoryName] ??
                    item.serviceCategoryName}
                </span>
                <span className={`${typography.f14R} ${styles.rowCount}`}>
                  {item.totalTransactionCount.toLocaleString()}건
                </span>
              </div>
              <span className={`${typography.f16EB} ${styles.rowAmount}`}>
                {toManwon(item.totalTransactionAmount)}원
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
