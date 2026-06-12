'use client';

import { typography } from '@repo/styles/typography';
import { ConfirmModal } from '@repo/ui/Modal';
import { useState } from 'react';

import * as styles from './SettingSection.css';

import type { ColDef } from '@/components/common/AdminTable';
import type { ReactNode } from 'react';

import { CheckableTable } from '@/components/common/CheckableTable';

export interface DeleteConfirm {
  message: string;
}

interface Props<T> {
  title: string;
  items: T[];
  cols: ColDef<T>[];
  getKey: (item: T) => string;
  emptyMessage: string;
  deleteConfirm?: DeleteConfirm;
  onDelete: (ids: string[]) => Promise<void>;
  renderRegisterModal?: (onClose: () => void) => ReactNode;
}

export default function SettingSection<T>({
  title,
  items,
  cols,
  getKey,
  emptyMessage,
  deleteConfirm,
  onDelete,
  renderRegisterModal,
}: Props<T>) {
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [registerOpen, setRegisterOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleToggle(id: string) {
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
    if (checkedIds.size === items.length) {
      setCheckedIds(new Set());
    } else {
      setCheckedIds(new Set(items.map((item) => getKey(item))));
    }
  }

  async function handleDeleteConfirm() {
    setIsPending(true);
    setErrorMessage(null);
    try {
      await onDelete([...checkedIds]);
      setCheckedIds(new Set());
      setDeleteOpen(false);
    } catch {
      setErrorMessage('삭제에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsPending(false);
    }
  }

  function handleRegisterClose() {
    setRegisterOpen(false);
  }

  const hasChecked = checkedIds.size > 0;

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h2 className={`${typography.f16EB} ${styles.title}`}>{title}</h2>
        <div className={styles.buttonGroup}>
          <button
            type="button"
            className={`${typography.f16B} ${styles.baseButton}`}
            onClick={() => {
              setRegisterOpen(true);
            }}
          >
            등록
          </button>
          <button
            type="button"
            className={`${typography.f16B} ${styles.baseButton}`}
            disabled={!hasChecked || isPending}
            onClick={() => {
              setDeleteOpen(true);
            }}
          >
            삭제
          </button>
        </div>
      </div>

      {errorMessage !== null && (
        <p className={`${typography.f14R} ${styles.errorText}`}>
          {errorMessage}
        </p>
      )}

      <CheckableTable
        cols={cols}
        items={items}
        getKey={getKey}
        checkedIds={checkedIds}
        onToggle={handleToggle}
        onToggleAll={handleToggleAll}
        emptyMessage={emptyMessage}
      />

      {registerOpen && renderRegisterModal !== undefined
        ? renderRegisterModal(handleRegisterClose)
        : null}

      <ConfirmModal
        isOpen={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
        }}
        title={title}
        description={
          deleteConfirm?.message ?? '선택한 항목을 노출 제외하시겠습니까?'
        }
        actions={[
          {
            label: '예',
            variant: 'blue',
            onClick: () => {
              void handleDeleteConfirm();
            },
          },
          {
            label: '아니오',
            variant: 'white',
            onClick: () => {
              setDeleteOpen(false);
            },
          },
        ]}
      />
    </div>
  );
}
