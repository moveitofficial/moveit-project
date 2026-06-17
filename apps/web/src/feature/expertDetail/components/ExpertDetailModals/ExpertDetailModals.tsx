'use client';

import { Modal } from '@repo/ui/Modal';
import { AlertCircle } from 'lucide-react';

import * as styles from './ExpertDetailModals.css';

interface RestrictionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExpertRestrictionModal({ isOpen, onClose }: RestrictionModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth={400}>
      <div className={styles.content}>
        <AlertCircle size={20} className={styles.warningIcon} aria-hidden />
        <p className={styles.title}>
          전문가 계정으로는
          <br />
          다른 전문가에게 상담 또는 좋아요
          <br />
          신고를 할 수 없습니다.
        </p>
        <button type="button" className={styles.primaryButton} onClick={onClose}>
          예
        </button>
      </div>
    </Modal>
  );
}
