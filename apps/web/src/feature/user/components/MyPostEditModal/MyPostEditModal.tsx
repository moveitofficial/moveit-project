'use client';

import { ApiError } from '@repo/fetcher';
import clsx from 'clsx';
import { useEffect, useId, useState } from 'react';

import { UserModal } from '../UserModal';

import * as styles from './MyPostEditModal.css';

import type { MyPostListItem } from '@/feature/user/my-posts/api';
import type { CommunityCategory } from '@/mocks/types';

import { MY_POST_EDIT_CATEGORIES } from '@/feature/user/my-posts/constants';
import { useUpdateMyPostMutation } from '@/feature/user/my-posts/queries';

const MODAL_MAX_WIDTH = 480;
const POST_TITLE_MAX_LENGTH = 100;

interface FormState {
  category: CommunityCategory;
  title: string;
  content: string;
}

interface Props {
  isOpen: boolean;
  post: MyPostListItem | null;
  onClose: () => void;
}

function toFormState(post: MyPostListItem): FormState {
  return {
    category: post.category,
    title: post.title,
    content: post.content,
  };
}

function isFormChanged(original: FormState, current: FormState): boolean {
  return (
    original.category !== current.category ||
    original.title.trim() !== current.title.trim() ||
    original.content.trim() !== current.content.trim()
  );
}

export default function MyPostEditModal({ isOpen, post, onClose }: Props) {
  const titleId = useId();
  const categoryId = useId();
  const postTitleId = useId();
  const contentId = useId();
  const [form, setForm] = useState<FormState>({
    category: 'QUESTION',
    title: '',
    content: '',
  });
  const [originalForm, setOriginalForm] = useState<FormState>({
    category: 'QUESTION',
    title: '',
    content: '',
  });
  const { mutate, isPending, error, reset } = useUpdateMyPostMutation();

  useEffect(() => {
    if (!isOpen || post === null) {
      return;
    }
    const nextForm = toFormState(post);
    setForm(nextForm);
    setOriginalForm(nextForm);
    reset();
  }, [post, isOpen, reset]);

  const trimmedTitle = form.title.trim();
  const trimmedContent = form.content.trim();
  const canSubmit =
    trimmedTitle.length > 0 &&
    trimmedContent.length > 0 &&
    isFormChanged(originalForm, {
      category: form.category,
      title: trimmedTitle,
      content: trimmedContent,
    }) &&
    !isPending;

  const handleClose = () => {
    setForm({ category: 'QUESTION', title: '', content: '' });
    setOriginalForm({ category: 'QUESTION', title: '', content: '' });
    reset();
    onClose();
  };

  const handleSubmit = () => {
    if (post === null || !canSubmit) {
      return;
    }

    mutate(
      {
        postId: post.id,
        body: {
          category: form.category,
          title: trimmedTitle,
          content: trimmedContent,
        },
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
          게시글 수정
        </h2>

        <div className={styles.field}>
          <label htmlFor={categoryId} className={styles.fieldLabel}>
            카테고리
          </label>
          <select
            id={categoryId}
            className={styles.select}
            value={form.category}
            onChange={(event) => {
              setForm((prev) => ({
                ...prev,
                category: event.target.value as CommunityCategory,
              }));
            }}
          >
            {MY_POST_EDIT_CATEGORIES.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor={postTitleId} className={styles.fieldLabel}>
            제목
          </label>
          <input
            id={postTitleId}
            type="text"
            className={styles.input}
            placeholder="제목을 입력해 주세요."
            maxLength={POST_TITLE_MAX_LENGTH}
            value={form.title}
            onChange={(event) => {
              setForm((prev) => ({ ...prev, title: event.target.value }));
            }}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor={contentId} className={styles.fieldLabel}>
            내용
          </label>
          <textarea
            id={contentId}
            className={styles.textarea}
            placeholder="내용을 입력해 주세요."
            value={form.content}
            onChange={(event) => {
              setForm((prev) => ({ ...prev, content: event.target.value }));
            }}
          />
        </div>

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
            게시글 수정
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
