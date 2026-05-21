'use client';

import clsx from 'clsx';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import * as styles from './Modal.css';

import type { MouseEvent, ReactNode } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: number;
  closeOnBackdrop?: boolean;
  className?: string;
  labelledBy?: string;
  describedBy?: string;
}

export interface ModalSectionProps {
  children: ReactNode;
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  maxWidth = 480,
  closeOnBackdrop = true,
  className,
  labelledBy,
  describedBy,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!closeOnBackdrop) return;
    if (event.target !== event.currentTarget) return;
    onClose();
  };

  return createPortal(
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        className={clsx(styles.panel, className)}
        style={{ maxWidth: `${maxWidth}px` }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

export function ModalHeader({ children, className }: ModalSectionProps) {
  return <div className={clsx(styles.header, className)}>{children}</div>;
}

export function ModalBody({ children, className }: ModalSectionProps) {
  return <div className={clsx(styles.body, className)}>{children}</div>;
}

export function ModalFooter({ children, className }: ModalSectionProps) {
  return <div className={clsx(styles.footer, className)}>{children}</div>;
}
