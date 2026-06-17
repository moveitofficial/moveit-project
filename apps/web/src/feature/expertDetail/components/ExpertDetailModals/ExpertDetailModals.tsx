'use client';

import { Modal } from '@repo/ui/Modal';
import { AlertCircle } from 'lucide-react';

import { EXPERT_INQUIRY_SUCCESS_MODAL_WIDTH } from '../../constants';

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

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExpertInquirySuccessModal({ isOpen, onClose }: SuccessModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth={EXPERT_INQUIRY_SUCCESS_MODAL_WIDTH}>
      <div className={styles.successContent}>
        <p className={styles.successTitle}>문의 메시지가 발송됐어요</p>
        <p className={styles.successDescription}>
          전문가에게 답변이 오면 알려드릴게요.
          {'\n'}
          보낸 문의는 [우측 상단 - 메시지 탭]에서 확인할 수 있어요.
        </p>
        <button type="button" className={styles.primaryButton} onClick={onClose}>
          메시지 보러가기
        </button>
        <button type="button" className={styles.secondaryButton} onClick={onClose}>
          확인
        </button>
      </div>
    </Modal>
  );
}
