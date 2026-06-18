'use client';

import { useState } from 'react';

import * as styles from './MyInfoFieldRow.css';

import type { ReactNode } from 'react';

interface Props {
  label: string;
  htmlFor?: string;
  readOnly?: boolean;
  hideActions?: boolean;
  isEditing?: boolean;
  onEditingChange?: (editing: boolean) => void;
  onSave?: () => void | Promise<void>;
  onCancel?: () => void;
  saveDisabled?: boolean;
  children: ReactNode | ((isEditing: boolean) => ReactNode);
}

export default function MyInfoFieldRow({
  label,
  htmlFor,
  readOnly = false,
  hideActions = false,
  isEditing: isEditingProp,
  onEditingChange,
  onSave,
  onCancel,
  saveDisabled = false,
  children,
}: Props) {
  const [internalEditing, setInternalEditing] = useState(false);
  const isControlled = isEditingProp !== undefined;
  const isEditing = isControlled ? isEditingProp : internalEditing;

  const setEditing = (next: boolean) => {
    if (!isControlled) {
      setInternalEditing(next);
    }
    onEditingChange?.(next);
  };

  const showActions = !readOnly && !hideActions && onSave !== undefined;
  const content =
    typeof children === 'function' ? children(isEditing) : children;

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = () => {
    if (onSave === undefined) return;

    void (async () => {
      try {
        await onSave();
        setEditing(false);
      } catch {
        // API 실패 시 편집 모드 유지
      }
    })();
  };

  const handleCancel = () => {
    onCancel?.();
    setEditing(false);
  };

  return (
    <div className={styles.field}>
      <div className={styles.fieldHeader}>
        {htmlFor === undefined ? (
          <span className={styles.label}>{label}</span>
        ) : (
          <label htmlFor={htmlFor} className={styles.label}>
            {label}
          </label>
        )}

        {showActions &&
          (isEditing ? (
            <div className={styles.actionButtons}>
              <button
                type="button"
                className={styles.actionButton}
                disabled={saveDisabled}
                onClick={handleSave}
              >
                저장
              </button>
              <button
                type="button"
                className={styles.actionButton}
                onClick={handleCancel}
              >
                취소
              </button>
            </div>
          ) : (
            <button
              type="button"
              className={styles.actionButton}
              onClick={handleEdit}
            >
              수정
            </button>
          ))}
      </div>

      {content}
    </div>
  );
}
