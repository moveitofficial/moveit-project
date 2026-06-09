'use client';

import clsx from 'clsx';

import * as styles from './OrderFilter.css';

import type {
  OrderCounts,
  OrderFilterParams,
  OrderSortKey,
} from '@/features/orders/types';

import { SearchBar } from '@/components/common/SearchBar';
import { ORDER_TABS } from '@/features/orders/constants';
import { useUpdateParam } from '@/utils/hooks';

interface Props {
  params: OrderFilterParams;
  tabCounts: OrderCounts;
}

const SORT_OPTIONS: { key: OrderSortKey; label: string }[] = [
  { key: 'latest', label: '최신순' },
  { key: 'deadline', label: '마감일순' },
];

export default function OrderFilter({ params, tabCounts }: Props) {
  const updateParam = useUpdateParam();
  const activeSort = params.sort ?? 'latest';

  return (
    <div className={styles.container}>
      <div className={styles.topRow}>
        <div className={styles.tabs}>
          {ORDER_TABS.map((tab) => {
            const isActive = (params.tab ?? null) === tab.key;
            const count = tab.key === null ? tabCounts.all : tabCounts[tab.key];
            return (
              <button
                key={tab.label}
                type="button"
                className={clsx(styles.tab, isActive && styles.tabActive)}
                onClick={() => {
                  updateParam('tab', tab.key ?? undefined);
                }}
              >
                {tab.label} {count}
              </button>
            );
          })}
        </div>

        <div className={styles.sortGroup}>
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.key}
              type="button"
              className={clsx(
                styles.sortTab,
                activeSort === option.key && styles.sortTabActive,
              )}
              onClick={() => {
                updateParam(
                  'sort',
                  option.key === 'latest' ? undefined : option.key,
                );
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.searchWrapper}>
        <SearchBar
          value={params.search}
          onChange={(value) => {
            updateParam('search', value === '' ? undefined : value);
          }}
          placeholder="구매자명으로 검색해주세요"
        />
      </div>
    </div>
  );
}
