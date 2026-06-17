'use client';

import { ApiError } from '@repo/fetcher';
import { Modal } from '@repo/ui/Modal';
import clsx from 'clsx';
import { useEffect, useId, useState } from 'react';

import { ReviewStars } from '../ReviewStars';

import * as styles from './MyReviewEditModal.css';

import type { MyReviewListItem } from '@/feature/user/my-reviews/api';

import { useUpdateMyReviewMutation } from '@/feature/user/my-reviews/queries';

const MODAL_MAX_WIDTH = 480;

interface Props {
  isOpen: boolean;
  review: MyReviewListItem | null;
  onClose: () => void;
}

export default function MyReviewEditModal({ isOpen, review, onClose }: Props) {
  const titleId = useId();
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const { mutate, isPending, error, reset } = useUpdateMyReviewMutation();

  useEffect(() => {
    if (!isOpen || review === null) {
      return;
    }
    setRating(Math.round(review.rating));
    setContent(review.content);
    reset();
  }, [isOpen, review, reset]);

  const trimmedContent = content.trim();
  const canSubmit =
    review !== null &&
    rating >= 1 &&
    rating <= 5 &&
    trimmedContent.length > 0 &&
    (rating !== Math.round(review.rating) || trimmedContent !== review.content.trim()) &&
    !isPending;

  const handleClose = () => {
    setRating(5);
    setContent('');
    reset();
    onClose();
  };

  const handleSubmit = () => {
    if (review === null || !canSubmit) {
      return;
    }
    mutate(
      {
        orderId: review.orderId,
        reviewId: review.id,
        rating,
        content: trimmedContent,
      },
      {
        onSuccess: () => {
          handleClose();
        },
      },
    );
  };

  const apiErrorMessage =
    error instanceof ApiError
      ? error.message
      : error instanceof Error
        ? error.message
        : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth={MODAL_MAX_WIDTH}
      labelledBy={titleId}
    >
      <div className={styles.content}>
        <h2 id={titleId} className={styles.title}>
          리뷰작성
        </h2>

        <div className={styles.ratingRow}>
          <ReviewStars
            value={rating}
            onChange={(value) => {
              setRating(value);
            }}
          />
          <p className={styles.ratingValue}>{rating}</p>
        </div>

        <textarea
          className={styles.textarea}
          placeholder="리뷰를 입력해 주세요."
          value={content}
          onChange={(event) => {
            setContent(event.target.value);
          }}
        />

        {apiErrorMessage === null ? null : (
          <p className={styles.errorMessage}>{apiErrorMessage}</p>
        )}

        <div className={styles.footer}>
          <button
            type="button"
            className={clsx(
              styles.submitButton,
              canSubmit ? undefined : styles.submitButtonDisabled,
            )}
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            리뷰 수정
          </button>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={handleClose}
          >
            아니오
          </button>
        </div>
      </div>
    </Modal>
  );
}
