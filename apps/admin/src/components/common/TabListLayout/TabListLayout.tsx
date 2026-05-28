import * as styles from './TabListLayout.css';

import type { UserTabType } from '@/components/common/UserTabs';
import type { ReactNode } from 'react';

import { ListLayout } from '@/components/common/ListLayout';
import { UserTabs } from '@/components/common/UserTabs';

interface Props {
  tab: UserTabType;
  clientCount: number;
  expertCount: number;
  filterSlot: ReactNode;
  tableSlot: ReactNode;
  page: number;
  totalPages: number;
}

export default function TabListLayout({
  tab,
  clientCount,
  expertCount,
  filterSlot,
  tableSlot,
  page,
  totalPages,
}: Props) {
  return (
    <div className={styles.container}>
      <UserTabs
        currentTab={tab}
        clientCount={clientCount}
        expertCount={expertCount}
      />

      <ListLayout
        filterSlot={filterSlot}
        tableSlot={tableSlot}
        page={page}
        totalPages={totalPages}
      />
    </div>
  );
}
