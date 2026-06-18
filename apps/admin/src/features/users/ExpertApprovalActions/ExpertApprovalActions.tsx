'use client';

import { typography } from '@repo/styles/typography';
import { ConfirmModal, Modal } from '@repo/ui/Modal';
import { useState, useTransition } from 'react';

import * as styles from './ExpertApprovalActions.css';

import { approveExpert, rejectExpert } from '@/features/users/actions';

interface Props {
  userId: string;
  businessName: string | null;
}

export default function ExpertApprovalActions({ userId, businessName }: Props) {
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isPending, startTransition] = useTransition();

  const displayName = businessName ?? '해당';

  function handleApprove() {
    startTransition(async () => {
      try {
        await approveExpert(userId);
        setIsApproveOpen(false);
      } catch {
        alert('판매자 승인 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    });
  }

  function handleReject() {
    const trimmedReason = rejectReason.trim();
    if (!trimmedReason) {
      return;
    }

    startTransition(async () => {
      try {
        await rejectExpert(userId, trimmedReason);
        setIsRejectOpen(false);
        setRejectReason('');
      } catch {
        alert(
          '판매자 승인 거절 처리 중 오류가 발생했습니다. 다시 시도해주세요.',
        );
      }
    });
  }

  function closeReject() {
    setIsRejectOpen(false);
    setRejectReason('');
  }

  return (
    <>
      <div className={styles.actions}>
        <button
          type="button"
          className={`${typography.f14EB} ${styles.actionButton}`}
          disabled={isPending}
          onClick={() => {
            setIsApproveOpen(true);
          }}
        >
          승인
        </button>
        <button
          type="button"
          className={`${typography.f14EB} ${styles.actionButton}`}
          disabled={isPending}
          onClick={() => {
            setIsRejectOpen(true);
          }}
        >
          거절
        </button>
      </div>

      <ConfirmModal
        isOpen={isApproveOpen}
        onClose={() => {
          setIsApproveOpen(false);
        }}
        title="판매자 승인"
        description={`${displayName} 유저\n판매자 승인 하시겠습니까?`}
        actions={[
          { label: '예', variant: 'blue', onClick: handleApprove },
          {
            label: '아니오',
            variant: 'white',
            onClick: () => {
              setIsApproveOpen(false);
            },
          },
        ]}
      />

      <Modal isOpen={isRejectOpen} onClose={closeReject} maxWidth={382}>
        <div className={styles.rejectModal}>
          <div className={styles.rejectModalTop}>
            <h2 className={`${typography.f18EB} ${styles.rejectModalTitle}`}>
              판매자 승인 거절
            </h2>
            <div className={styles.rejectField}>
              <p className={typography.f14EB}>거절 사유</p>
              <textarea
                className={`${typography.f16R} ${styles.textarea}`}
                placeholder="판매자 거절 사유를 입력해주세요"
                value={rejectReason}
                onChange={(e) => {
                  setRejectReason(e.target.value);
                }}
              />
            </div>
          </div>
          <div className={styles.rejectModalActions}>
            <button
              type="button"
              className={styles.rejectSubmitButton}
              disabled={isPending || !rejectReason.trim()}
              onClick={handleReject}
            >
              판매자 승인 거절
            </button>
            <button
              type="button"
              className={styles.rejectCancelButton}
              disabled={isPending}
              onClick={closeReject}
            >
              아니오
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
