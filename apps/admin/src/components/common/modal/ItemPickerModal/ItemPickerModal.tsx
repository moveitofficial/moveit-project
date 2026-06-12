'use client';

import { ApiError } from '@repo/fetcher';
import { Modal } from '@repo/ui/Modal';
import { useEffect, useRef, useState } from 'react';

import * as styles from './ItemPickerModal.css';

import type { ColDef } from '@/components/common/AdminTable';
import type { ApiSuccess, Pagination as PaginationType } from '@/types/api';

import { CheckableTable } from '@/components/common/CheckableTable';
import { SearchBar } from '@/components/common/SearchBar';

const PAGE_SIZE = 100;
const MODAL_MAX_WIDTH = 1664;

interface CandidateItem {
  isAlreadyRegistered: boolean;
}

export interface PickerRegisteredEntry {
  id: string;
  label: string;
}

export interface PickerCandidatesData<T> {
  items: T[];
  pagination: PaginationType;
  registered: PickerRegisteredEntry[];
}

export interface FetchParams {
  search?: string;
  sort?: 'sales' | 'created';
  page?: number;
  pageSize?: number;
}

interface Props<T extends CandidateItem> {
  onClose: () => void;
  title: string;
  confirmLabel: string;
  searchPlaceholder: string;
  summaryPrefix: string;
  createdSortLabel?: string;
  fetchCandidates: (params: FetchParams) => Promise<ApiSuccess<PickerCandidatesData<T>>>;
  getKey: (item: T) => string;
  getSummaryLabel: (item: T) => string;
  cols: ColDef<T>[];
  onConfirm: (ids: string[]) => Promise<void>;
  maxWidth?: number;
}

export default function ItemPickerModal<T extends CandidateItem>({
  onClose,
  title,
  confirmLabel,
  searchPlaceholder,
  summaryPrefix,
  createdSortLabel = '등록일 순',
  fetchCandidates,
  getKey,
  getSummaryLabel,
  cols,
  onConfirm,
  maxWidth = MODAL_MAX_WIDTH,
}: Props<T>) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'sales' | 'created'>('sales');
  const [items, setItems] = useState<T[]>([]);
  const [registeredEntries, setRegisteredEntries] = useState<PickerRegisteredEntry[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set());
  const [isPending, setIsPending] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  const fetchRef = useRef(fetchCandidates);
  fetchRef.current = fetchCandidates;

  const getKeyRef = useRef(getKey);
  getKeyRef.current = getKey;

  useEffect(() => {
    setLoading(true);
    setFetchError(null);

    void (async () => {
      try {
        const res = await fetchRef.current({
          search: search || undefined,
          sort,
          page: 1,
          pageSize: PAGE_SIZE,
        });

        const nextItems = res.data.items;
        const nextRegistered = res.data.registered;

        setItems(nextItems);
        setRegisteredEntries(nextRegistered);

        const registeredIdSet = new Set(nextRegistered.map((entry) => entry.id));
        setRegisteredIds(registeredIdSet);
        setCheckedIds((prev) => {
          const next = new Set<string>();
          for (const entry of nextRegistered) {
            next.add(entry.id);
          }
          for (const id of prev) {
            if (!registeredIdSet.has(id)) {
              next.add(id);
            }
          }
          return next;
        });
      } catch {
        setFetchError('데이터를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    })();
  }, [search, sort]);

  function handleToggle(id: string) {
    if (registeredIds.has(id)) return;
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function handleToggleAll() {
    const selectableIds = items
      .filter((item) => !item.isAlreadyRegistered)
      .map((item) => getKey(item));
    const allSelected = selectableIds.every((id) => checkedIds.has(id));
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        for (const id of selectableIds) {
          next.delete(id);
        }
      } else {
        for (const id of selectableIds) {
          next.add(id);
        }
      }
      return next;
    });
  }

  async function handleConfirm() {
    const newIds = [...checkedIds].filter((id) => !registeredIds.has(id));
    setIsPending(true);
    setConfirmError(null);
    try {
      await onConfirm(newIds);
      onClose();
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        setConfirmError(error.message);
      } else {
        setConfirmError('등록에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsPending(false);
    }
  }

  const newlySelectedIds = [...checkedIds].filter((id) => !registeredIds.has(id));
  const newlySelectedLabels = items
    .filter((item) => newlySelectedIds.includes(getKey(item)))
    .map((item) => getSummaryLabel(item));
  const summaryLabels = [
    ...registeredEntries.map((entry) => entry.label),
    ...newlySelectedLabels,
  ];
  const summaryText =
    summaryLabels.length > 0
      ? `${summaryPrefix} : ${summaryLabels.join(', ')}`
      : `${summaryPrefix} :`;

  return (
    <Modal isOpen={true} onClose={onClose} maxWidth={maxWidth}>
      <div className={styles.content}>
        <h2 className={styles.modalTitle}>{title}</h2>

        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder={searchPlaceholder}
            />
          </div>
          <div className={styles.sortGroup}>
            <button
              type="button"
              className={
                sort === 'sales' ? styles.sortButtonActive : styles.sortButton
              }
              onClick={() => {
                setSort('sales');
              }}
            >
              판매량순
            </button>
            <span className={styles.sortDivider} aria-hidden>
              |
            </span>
            <button
              type="button"
              className={
                sort === 'created' ? styles.sortButtonActive : styles.sortButton
              }
              onClick={() => {
                setSort('created');
              }}
            >
              {createdSortLabel}
            </button>
          </div>
        </div>

        <div className={styles.tableSection}>
          {loading ? (
            <p className={styles.statusMessage}>불러오는 중...</p>
          ) : fetchError === null ? (
            <div className={styles.tableContainer}>
              <CheckableTable
                cols={cols}
                items={items}
                getKey={getKey}
                checkedIds={checkedIds}
                onToggle={handleToggle}
                onToggleAll={handleToggleAll}
                emptyMessage="검색 결과가 없습니다."
                fillHeight
              />
            </div>
          ) : (
            <p className={`${styles.statusMessage} ${styles.errorMessage}`}>
              {fetchError}
            </p>
          )}

          <p className={styles.registeredSummary}>{summaryText}</p>
        </div>

        <div className={styles.footer}>
          {confirmError !== null && (
            <p className={styles.errorMessage}>{confirmError}</p>
          )}
          <button
            type="button"
            className={styles.confirmButton}
            disabled={newlySelectedIds.length === 0 || isPending}
            onClick={() => {
              void handleConfirm();
            }}
          >
            {confirmLabel}
          </button>
          <button type="button" className={styles.cancelButton} onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </Modal>
  );
}
