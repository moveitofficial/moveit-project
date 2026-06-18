'use client';

import { ApiError } from '@repo/fetcher';
import clsx from 'clsx';
import { useEffect, useId, useState } from 'react';

import { UserModal } from '../UserModal';

import * as styles from './MyCommentEditModal.css';

import type { MyCommentListItem } from '@/feature/user/my-comments/api';

import { useUpdateMyCommentMutation } from '@/feature/user/my-comments/queries';

const MODAL_MAX_WIDTH = 480;
const COMMENT_MAX_LENGTH = 1000;

interface Props {
  isOpen: boolean;
  comment: MyCommentListItem | null;
  onClose: () => void;
}

export default function MyCommentEditModal({
  isOpen,
  comment,
  onClose,
}: Props) {
  const titleId = useId();
  const [content, setContent] = useState('');
  const { mutate, isPending, error, reset } = useUpdateMyCommentMutation();

  useEffect(() => {
    if (!isOpen || comment === null) {
      return;
    }
    setContent(comment.content);
    reset();
  }, [comment, isOpen, reset]);

  const trimmedContent = content.trim();
  const originalContent = comment?.content.trim() ?? '';
  const canSubmit =
    trimmedContent.length > 0 &&
    trimmedContent !== originalContent &&
    !isPending;

  const handleClose = () => {
    setContent('');
    reset();
    onClose();
  };

  const handleSubmit = () => {
    if (comment === null || !canSubmit) {
      return;
    }

    mutate(
      {
        postId: comment.post.id,
        commentId: comment.id,
        content: trimmedContent,
      },
      {
        onSuccess: () => {
          handleClose();
        },
      },
    );
  };

  const apiErrorMessage = error instanceof ApiError ? error.message : null;

  return (
    <UserModal
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth={MODAL_MAX_WIDTH}
      labelledBy={titleId}
    >
      <div className={styles.content}>
        <h2 id={titleId} className={styles.title}>
          댓글 수정
        </h2>
        <textarea
          className={styles.textarea}
          placeholder="댓글을 입력해 주세요."
          maxLength={COMMENT_MAX_LENGTH}
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
            댓글 수정
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
    </UserModal>
  );
}
