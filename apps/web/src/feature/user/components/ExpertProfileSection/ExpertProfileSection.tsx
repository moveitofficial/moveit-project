'use client';

import { useState } from 'react';

import * as styles from './ExpertProfileSection.css';

import type { ReactNode } from 'react';

interface Props {
  title: string;
  onSave: () => void | Promise<void>;
  onCancel: () => void;
  saveDisabled?: boolean;
  children: ReactNode | ((isEditing: boolean) => ReactNode);
}

export default function ExpertProfileSection({
  title,
  onSave,
  onCancel,
  saveDisabled = false,
  children,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    void (async () => {
      try {
        await onSave();
        setIsEditing(false);
      } catch {
        // API 실패 시 편집 모드 유지
      }
    })();
  };

  const handleCancel = () => {
    onCancel();
    setIsEditing(false);
  };

  const handleEdit = () => {
    onCancel();
    setIsEditing(true);
  };

  const content =
    typeof children === 'function' ? children(isEditing) : children;

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {isEditing ? (
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
        )}
      </div>
      {content}
    </section>
  );
}
