'use client';

import { Modal } from '@repo/ui/Modal';
import { useRouter } from 'next/navigation';

import { CONSULTATION_SUCCESS_MODAL_WIDTH } from '../../constants';

import * as styles from './ConsultationSuccessModal.css';

interface Props {
  isOpen: boolean;
  roomId: string | null;
  onClose: () => void;
}

export default function ConsultationSuccessModal({
  isOpen,
  roomId,
  onClose,
}: Props) {
  const router = useRouter();

  const handleGoToMessage = () => {
    onClose();
    if (roomId !== null) {
      router.push(`/service/message?roomId=${roomId}`);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth={CONSULTATION_SUCCESS_MODAL_WIDTH}>
      <div className={styles.content}>
        <p className={styles.title}>문의 메시지가 발송됐어요</p>
        <p className={styles.description}>
          전문가에게 답변이 오면 알려드릴게요.
          {'\n'}
          보낸 문의는 [우측 상단 - 메시지 탭]에서 확인할 수 있어요.
        </p>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={handleGoToMessage}
        >
          메시지 보러가기
        </button>
        <button type="button" className={styles.secondaryButton} onClick={onClose}>
          확인
        </button>
      </div>
    </Modal>
  );
}
