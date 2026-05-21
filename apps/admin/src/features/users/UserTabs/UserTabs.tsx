'use client';

import { typography } from '@repo/styles/typography';
import { useRouter } from 'next/navigation';

import * as styles from './UserTabs.css';

import type { UserTabType } from '@/features/users/types';

interface Props {
  currentTab: UserTabType;
  clientCount: number;
  expertCount: number;
}

export default function UserTabs({
  currentTab,
  clientCount,
  expertCount,
}: Props) {
  const router = useRouter();

  const TABS: { value: UserTabType; label: string; count: number }[] = [
    { value: 'CLIENT', label: '일반 유저', count: clientCount },
    { value: 'EXPERT', label: '판매자 유저', count: expertCount },
  ];

  const handleTabClick = (tab: UserTabType) => {
    if (tab === currentTab) return;
    router.push(`?tab=${tab}`);
  };

  return (
    <div className={styles.container} role="tablist">
      {TABS.map(({ value, label, count }) => (
        <button
          key={value}
          role="tab"
          aria-selected={currentTab === value}
          className={`${typography.f16R} ${styles.tab}`}
          onClick={() => {
            handleTabClick(value);
          }}
        >
          <span>{label}</span>
          <span className={`${typography.f12R} ${styles.count}`}>{count}</span>
        </button>
      ))}
    </div>
  );
}
