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
  emptyContent?: ReactNode;
  fillHeight?: boolean;
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
  emptyContent,
  fillHeight = false,
}: Props<T>) {
  const useStickyScroll = fillHeight && items.length > 0;

  const header = (
    <div
      className={`${typography.f16R} ${styles.header} ${useStickyScroll ? styles.headerSticky : ''}`}
    >
      {cols.map((col) => (
        <div key={col.key} className={col.headerStyle}>
          {col.header}
        </div>
      ))}
    </div>
  );

  const body =
    items.length === 0 ? (
      <div
        className={`${styles.empty} ${fillHeight ? styles.emptyFill : ''}`}
      >
        {emptyContent ?? (
          <p className={typography.f16R}>조회된 결과가 없습니다.</p>
        )}
      </div>
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
    );

  return (
    <div
      className={`${styles.wrapper} ${fillHeight ? styles.wrapperFill : ''}`}
    >
      {useStickyScroll ? (
        <div className={styles.scrollBody}>{header}{body}</div>
      ) : (
        <>
          {header}
          {body}
        </>
      )}
    </div>
  );
}
