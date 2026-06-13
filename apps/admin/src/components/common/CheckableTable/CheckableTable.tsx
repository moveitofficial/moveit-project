'use client';

import { typography } from '@repo/styles/typography';

import * as styles from './CheckableTable.css';

import type { ColDef } from '@/components/common/AdminTable';

interface Props<T> {
  cols: ColDef<T>[];
  items: T[];
  getKey: (item: T) => string;
  checkedIds: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: () => void;
  emptyMessage: string;
  fillHeight?: boolean;
}

export default function CheckableTable<T>({
  cols,
  items,
  getKey,
  checkedIds,
  onToggle,
  onToggleAll,
  emptyMessage,
  fillHeight = false,
}: Props<T>) {
  const allChecked = items.length > 0 && checkedIds.size === items.length;
  const someChecked = checkedIds.size > 0 && checkedIds.size < items.length;
  const useStickyScroll = fillHeight && items.length > 0;

  const header = (
    <div
      className={`${typography.f16B} ${styles.header} ${useStickyScroll ? styles.headerSticky : ''}`}
    >
      <div className={styles.colCheckbox}>
        <input
          type="checkbox"
          checked={allChecked}
          ref={(el) => {
            if (el) el.indeterminate = someChecked;
          }}
          onChange={onToggleAll}
          aria-label="전체 선택"
        />
      </div>
      {cols.map((col) => (
        <div
          key={col.key}
          className={`${col.headerStyle} ${styles.colDivider}`}
        >
          {col.header}
        </div>
      ))}
    </div>
  );

  const body =
    items.length === 0 ? (
      <p
        className={`${typography.f18EB} ${styles.empty} ${fillHeight ? styles.emptyFill : ''}`}
      >
        {emptyMessage}
      </p>
    ) : (
      <ul className={styles.list}>
        {items.map((item, i) => {
          const id = getKey(item);
          const rowNum = String(i + 1).padStart(2, '0');

          return (
            <li key={id} className={`${typography.f16R} ${styles.row}`}>
              <div className={styles.colCheckbox}>
                <input
                  type="checkbox"
                  checked={checkedIds.has(id)}
                  onChange={() => {
                    onToggle(id);
                  }}
                  aria-label={`항목 ${String(i + 1)} 선택`}
                />
              </div>
              {cols.map((col) => (
                <div
                  key={col.key}
                  className={`${col.cellStyle} ${styles.colDivider}`}
                >
                  {col.render(item, rowNum)}
                </div>
              ))}
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
        <div className={styles.scrollBody}>
          {header}
          {body}
        </div>
      ) : (
        <>
          {header}
          {body}
        </>
      )}
    </div>
  );
}
