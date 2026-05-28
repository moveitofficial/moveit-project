import { Pagination } from '@repo/ui/Pagination';
import { Suspense } from 'react';

import * as styles from './ListLayout.css';

import type { ReactNode } from 'react';

interface Props {
  filterSlot: ReactNode;
  tableSlot: ReactNode;
  page: number;
  totalPages: number;
}

export default function ListLayout({
  filterSlot,
  tableSlot,
  page,
  totalPages,
}: Props) {
  return (
    <div className={styles.container}>
      <Suspense fallback={null}>
        <div className={styles.filterSection}>{filterSlot}</div>
      </Suspense>

      <div className={styles.tableSection}>{tableSlot}</div>

      <Suspense fallback={null}>
        <div className={styles.pagination}>
          <Pagination currentPage={page} totalPages={totalPages} />
        </div>
      </Suspense>
    </div>
  );
}
