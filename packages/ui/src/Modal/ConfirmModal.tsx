'use client';

import { useId } from 'react';

import * as styles from './ConfirmModal.css';
import Modal from './Modal';

import type { ReactNode } from 'react';

export type ConfirmModalActionVariant = 'blue' | 'red' | 'white';

export interface ConfirmModalAction {
  label: string;
  variant: ConfirmModalActionVariant;
  onClick: () => void;
}

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: ReactNode;
  actions: ConfirmModalAction[];
  maxWidth?: number;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  title,
  description,
  actions,
  maxWidth = 357,
}: ConfirmModalProps) {
  const titleId = useId();
  const descriptionId = useId();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth={maxWidth}
      labelledBy={titleId}
      describedBy={descriptionId}
    >
      <div className={styles.content}>
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        <div id={descriptionId} className={styles.description}>
          {description}
        </div>
        <div className={styles.actions}>
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              className={
                action.variant === 'red'
                  ? styles.redButton
                  : action.variant === 'blue'
                    ? styles.blueButton
                    : styles.whiteButton
              }
              onClick={action.onClick}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}
