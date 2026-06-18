'use client';

import { ApiError } from '@repo/fetcher';
import { typography } from '@repo/styles/typography';
import { Modal } from '@repo/ui/Modal';
import clsx from 'clsx';
import { useEffect, useRef, useState, useTransition } from 'react';

import * as styles from './ReviewModal.css';

import type { ReviewData } from '@/feature/orders/types';

import { submitReview, updateReview } from '@/feature/orders/actions';
import { getOrderReview } from '@/feature/orders/api';

export type ReviewModalProps =
  | {
      mode: 'write';
      orderId: string;
      isOpen: boolean;
      onClose: () => void;
      onCompleted: (review: ReviewData) => void;
    }
  | {
      mode: 'view';
      orderId: string;
      isOpen: boolean;
      onClose: () => void;
      onEdit?: (review: ReviewData) => void;
      onDelete?: () => void;
    }
  | {
      mode: 'edit';
      orderId: string;
      reviewId: string;
      initialRating: number;
      initialContent: string;
      isOpen: boolean;
      onClose: () => void;
      onCompleted: (review: ReviewData) => void;
    };

const STAR_COUNT = 5;

export default function ReviewModal(props: ReviewModalProps) {
  const { isOpen, onClose } = props;
  const [rating, setRating] = useState(
    props.mode === 'edit' ? props.initialRating : 0,
  );
  const [hovered, setHovered] = useState(0);
  const [content, setContent] = useState(
    props.mode === 'edit' ? props.initialContent : '',
  );
  const [isPending, startTransition] = useTransition();

  const [review, setReview] = useState<ReviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const cancelledRef = useRef(false);
  const viewOrderId = props.mode === 'view' ? props.orderId : null;

  useEffect(() => {
    if (viewOrderId === null || !isOpen) {
      setReview(null);
      setFetchError(null);
      return;
    }

    cancelledRef.current = false;
    setIsLoading(true);
    setFetchError(null);

    void (async () => {
      try {
        const { data } = await getOrderReview(viewOrderId);
        if (cancelledRef.current) return;
        setReview(data);
      } catch (error: unknown) {
        if (cancelledRef.current) return;
        setReview(null);
        setFetchError(
          error instanceof ApiError
            ? error.message
            : '리뷰를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.',
        );
      } finally {
        if (!cancelledRef.current) setIsLoading(false);
      }
    })();

    return () => {
      cancelledRef.current = true;
    };
  }, [viewOrderId, isOpen, retryCount]);

  if (props.mode === 'view') {
    const { onEdit, onDelete } = props;
    return (
      <Modal isOpen={isOpen} onClose={onClose} maxWidth={382}>
        <div className={styles.modal}>
          <div className={styles.headerReadOnly}>
            <h2 className={`${typography.f18EB} ${styles.title}`}>리뷰 보기</h2>
            {review !== null && (
              <div className={styles.starsReadOnlyRow}>
                <div
                  className={styles.starsReadOnly}
                  aria-label={`별점 ${review.rating}점`}
                >
                  {Array.from({ length: STAR_COUNT }, (_, i) => i + 1).map(
                    (star) => (
                      <span
                        key={star}
                        className={
                          star <= review.rating
                            ? styles.starFilled
                            : styles.starEmpty
                        }
                        aria-hidden="true"
                      >
                        ★
                      </span>
                    ),
                  )}
                </div>
                <span className={styles.ratingNumber}>{review.rating}</span>
              </div>
            )}
          </div>

          {isLoading && <p className={styles.statusMessage}>불러오는 중...</p>}

          {!isLoading && fetchError !== null && (
            <p className={styles.errorMessage} role="alert">
              {fetchError}
            </p>
          )}

          {!isLoading && review !== null && (
            <p className={`${typography.f16R} ${styles.content}`}>
              {review.content}
            </p>
          )}

          {!isLoading && fetchError === null && review !== null && (
            <div className={styles.linkRow}>
              {onEdit !== undefined && (
                <button
                  type="button"
                  className={styles.subButton}
                  onClick={() => {
                    onEdit(review);
                  }}
                >
                  수정
                </button>
              )}
              {onDelete !== undefined && (
                <button
                  type="button"
                  className={styles.subButton}
                  onClick={onDelete}
                >
                  삭제
                </button>
              )}
            </div>
          )}

          {!isLoading && fetchError !== null ? (
            <button
              type="button"
              className={styles.confirmButton}
              onClick={() => {
                setRetryCount((count) => count + 1);
              }}
            >
              다시 시도
            </button>
          ) : (
            <button
              type="button"
              className={styles.confirmButton}
              onClick={onClose}
            >
              확인
            </button>
          )}
        </div>
      </Modal>
    );
  }

  const { orderId, onCompleted } = props;
  const isEdit = props.mode === 'edit';
  const activeRating = hovered > 0 ? hovered : rating;

  function handleClose() {
    setRating(props.mode === 'edit' ? props.initialRating : 0);
    setContent(props.mode === 'edit' ? props.initialContent : '');
    setHovered(0);
    onClose();
  }

  function handleSubmit() {
    if (rating === 0 || !content.trim()) {
      return;
    }
    startTransition(() => {
      void (async () => {
        try {
          const review =
            props.mode === 'edit'
              ? await updateReview(
                  orderId,
                  props.reviewId,
                  rating,
                  content.trim(),
                )
              : await submitReview(orderId, rating, content.trim());
          onCompleted(review);
          handleClose();
        } catch {
          alert(
            `리뷰 ${isEdit ? '수정' : '작성'} 중 오류가 발생했습니다. 다시 시도해주세요.`,
          );
        }
      })();
    });
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth={382}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={`${typography.f18EB} ${styles.title}`}>
            {isEdit ? '리뷰 수정' : '리뷰 작성'}
          </h2>
          <div className={styles.stars} role="group" aria-label="별점 선택">
            {Array.from({ length: STAR_COUNT }, (_, i) => i + 1).map((star) => (
              <button
                key={star}
                type="button"
                aria-label={`${star}점`}
                className={clsx(
                  styles.starButton,
                  star <= activeRating && styles.starButtonActive,
                )}
                onClick={() => {
                  setRating(star);
                }}
                onMouseEnter={() => {
                  setHovered(star);
                }}
                onMouseLeave={() => {
                  setHovered(0);
                }}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <textarea
          className={`${typography.f16R} ${styles.textarea}`}
          placeholder="서비스에 대한 솔직한 리뷰를 작성해 주세요."
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
          }}
        />
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.confirmButton}
            disabled={isPending || rating === 0 || !content.trim()}
            onClick={handleSubmit}
          >
            {isEdit ? '수정 완료' : '리뷰 작성'}
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
      </div>
    </Modal>
  );
}
