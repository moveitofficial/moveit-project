'use client';

import * as styles from './MyInfoFieldRow.css';

import type { ReactNode } from 'react';

interface Props {
  label: string;
  htmlFor?: string;
  readOnly?: boolean;
  onSave?: () => void;
  saveDisabled?: boolean;
  children: ReactNode;
}

export default function MyInfoFieldRow({
  label,
  htmlFor,
  readOnly = false,
  onSave,
  saveDisabled = false,
  children,
}: Props) {
  const showSave = !readOnly && onSave !== undefined;

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

        {showSave && (
          <button
            type="button"
            className={styles.saveButton}
            disabled={saveDisabled}
            onClick={onSave}
          >
            저장
          </button>
        )}
      </div>

      {children}
    </div>
  );
}
