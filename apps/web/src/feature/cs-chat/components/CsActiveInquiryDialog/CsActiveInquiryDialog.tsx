'use client';

import * as styles from './CsActiveInquiryDialog.css';

interface CsActiveInquiryDialogProps {
  onGoActive: () => void;
  onStartNew: () => void;
  onCancel: () => void;
}

export default function CsActiveInquiryDialog({
  onGoActive,
  onStartNew,
  onCancel,
}: CsActiveInquiryDialogProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.card} role="dialog" aria-modal="true">
        <div className={styles.texts}>
          <p className={styles.title}>이미 진행중인 문의가 있어요</p>
          <p className={styles.desc}>
            새 문의를 여러번 남길 경우, 오히려 답변이 늦어질 수 있으니
            유의해주세요.
          </p>
        </div>
        <button type="button" className={styles.primaryButton} onClick={onGoActive}>
          진행중인 문의로 가기
        </button>
        <button type="button" className={styles.primaryButton} onClick={onStartNew}>
          새 문의하기
        </button>
        <button type="button" className={styles.cancel} onClick={onCancel}>
          취소
        </button>
      </div>
    </div>
  );
}
