import { typography } from '@repo/styles/typography';
import Link from 'next/link';

import * as styles from './AdminTable.css';

import type { Route } from 'next';
import type { ReactNode } from 'react';

export interface ColDef<T> {
  key: string;
  header: string;
  headerStyle: string;
  cellStyle: string;
  render: (item: T, rowNum: string) => ReactNode;
}

interface Props<T> {
  cols: ColDef<T>[];
  items: T[];
  getKey: (item: T) => string;
  page: number;
  pageSize: number;
  getHref?: (item: T) => string;
}

function toRowNum(page: number, pageSize: number, index: number): string {
  const n = (page - 1) * pageSize + index + 1;
  return n < 10 ? String(n).padStart(2, '0') : String(n);
}

export default function AdminTable<T>({
  cols,
  items,
  getKey,
  page,
  pageSize,
  getHref,
}: Props<T>) {
  return (
    <div className={styles.wrapper}>
      <div className={`${typography.f16B} ${styles.header}`}>
        {cols.map((col) => (
          <div key={col.key} className={col.headerStyle}>
            {col.header}
          </div>
        ))}
      </div>

      {items.length === 0 ? (
        <p className={`${typography.f16R} ${styles.empty}`}>
          조회된 결과가 없습니다.
        </p>
      ) : (
        <ul className={styles.list}>
          {items.map((item, i) => {
            const href = getHref?.(item);
            const cells = cols.map((col) => (
              <div key={col.key} className={col.cellStyle}>
                {col.render(item, toRowNum(page, pageSize, i))}
              </div>
            ));

            return (
              <li key={getKey(item)} className={`${typography.f16R} ${styles.row}`}>
                {href ? (
                  <Link href={href as Route} className={styles.rowLink}>
                    {cells}
                  </Link>
                ) : (
                  cells
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
