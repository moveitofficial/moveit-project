'use client';

import { typography } from '@repo/styles/typography';
import { Modal } from '@repo/ui/Modal';
import { formatDate } from '@repo/utils';
import { useEffect, useRef, useState, useTransition } from 'react';

import { COMMUNITY_DELETE_COPY } from './communityDeleteConstants';
import * as styles from './CommunityDeletionModal.css';

import type { CommunityContentType, CommunityDeletionInfo } from '@/features/users/types';

import {
  deleteCommunityComment,
  deleteCommunityPost,
} from '@/features/users/actions';
import {
  getCommentDeletion,
  getPostDeletion,
} from '@/features/users/api';

interface Props {
  userId: string;
  contentType: CommunityContentType;
  contentId: string;
  mode: 'delete' | 'reason';
  isOpen: boolean;
  onClose: () => void;
}

export default function CommunityDeletionModal({
  userId,
  contentType,
  contentId,
  mode,
  isOpen,
  onClose,
}: Props) {
  const copy = COMMUNITY_DELETE_COPY[contentType];

  const [reason, setReason] = useState('');
  const [isPending, startTransition] = useTransition();

  const [deletionInfo, setDeletionInfo] = useState<CommunityDeletionInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const cancelledRef = useRef(false);

  function handleClose() {
    setReason('');
    onClose();
  }

  function handleSubmit() {
    const trimmedReason = reason.trim();
    if (!trimmedReason) return;
    startTransition(async () => {
      try {
        await (contentType === 'post'
          ? deleteCommunityPost(userId, contentId, trimmedReason)
          : deleteCommunityComment(userId, contentId, trimmedReason));
        handleClose();
      } catch {
        alert('삭제 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    });
  }

  useEffect(() => {
    if (mode !== 'reason') return;

    if (!isOpen) {
      setDeletionInfo(null);
      return;
    }

    cancelledRef.current = false;
    setIsLoading(true);

    void (async () => {
      try {
        const { data } =
          contentType === 'post'
            ? await getPostDeletion(contentId)
            : await getCommentDeletion(contentId);

        if (cancelledRef.current) return;
        setDeletionInfo(data);
      } catch {
        alert('삭제 사유를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.');
        onClose();
      } finally {
        if (!cancelledRef.current) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelledRef.current = true;
    };
  }, [isOpen, mode, contentType, contentId, onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={mode === 'delete' ? handleClose : onClose}
      maxWidth={382}
    >
      <div className={styles.modal}>
        <div className={styles.top}>
          <h2 className={`${typography.f18EB} ${styles.title}`}>{copy.title}</h2>

          {mode === 'delete' ? (
            <div className={styles.field}>
              <p className={typography.f14EB}>삭제 사유</p>
              <textarea
                className={`${typography.f16R} ${styles.textarea}`}
                placeholder={copy.placeholder}
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                }}
              />
            </div>
          ) : !isLoading && deletionInfo !== null ? (
            <div className={styles.reasonSection}>
              <p className={typography.f14EB}>삭제 사유</p>
              <div className={styles.reasonMeta}>
                <span className={typography.f12R}>
                  삭제일 : {formatDate(deletionInfo.deletedAt)}
                </span>
                <span className={typography.f12R}>
                  {deletionInfo.deletedByAdminName}
                </span>
              </div>
              <p className={`${typography.f14R} ${styles.reasonText}`}>
                {deletionInfo.deleteReason}
              </p>
            </div>
          ) : null}
        </div>

        {mode === 'delete' ? (
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.submitButton}
              disabled={isPending || !reason.trim()}
              onClick={handleSubmit}
            >
              {copy.submitLabel}
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              disabled={isPending}
              onClick={handleClose}
            >
              아니오
            </button>
          </div>
        ) : (
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.submitButton}
              disabled={isLoading}
              onClick={onClose}
            >
              확인
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
