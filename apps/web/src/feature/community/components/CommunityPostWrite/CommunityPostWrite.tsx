'use client';

import { ApiError } from '@repo/fetcher';
import { Modal } from '@repo/ui/Modal';
import clsx from 'clsx';
import { CircleAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { createCommunityPost, updateCommunityPost } from '../../api';

import * as styles from './CommunityPostWrite.css';

import type { CommunityCategory } from '../../types';

import { RichTextEditor } from '@/feature/expertService/components/RichTextEditor';

const WRITE_CATEGORIES: { id: CommunityCategory; label: string }[] = [
  { id: 'QUESTION', label: '질문' },
  { id: 'TIP', label: 'Tip·공유' },
  { id: 'REVIEW', label: '후기' },
  { id: 'STUDY_GROUP', label: '스터디 모임' },
  { id: 'FREE', label: '자유' },
];

const TITLE_MAX = 100;

// 태그 제거 후 실제 텍스트가 비어있는지(에디터 빈 본문 판별).
const isContentEmpty = (html: string): boolean =>
  html.replaceAll(/<[^>]*>/g, '').trim() === '';

// 에디터는 굵게/기울임을 <b>/<i>로 내지만 서버 sanitize는 strong/em만 허용 → 변환.
const toServerContent = (html: string): string =>
  html
    .replaceAll(/<(\/?)b\b[^>]*>/g, '<$1strong>')
    .replaceAll(/<(\/?)i\b[^>]*>/g, '<$1em>');

interface Props {
  // 있으면 편집 모드(기존 글 수정).
  postId?: string;
  initial?: { category: CommunityCategory; title: string; content: string };
}

export default function CommunityPostWrite({ postId, initial }: Props) {
  const router = useRouter();
  const isEdit = postId !== undefined;
  const [category, setCategory] = useState<CommunityCategory>(
    initial?.category ?? 'QUESTION',
  );
  const [title, setTitle] = useState(initial?.title ?? '');
  const [content, setContent] = useState(initial?.content ?? '');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const canSubmit =
    title.trim() !== '' &&
    title.length <= TITLE_MAX &&
    !isContentEmpty(content) &&
    !pending;

  const handleSubmit = () => {
    if (!canSubmit) {
      return;
    }
    setPending(true);
    const body = {
      category,
      title: title.trim(),
      content: toServerContent(content),
    };
    const request =
      postId === undefined
        ? createCommunityPost(body)
        : updateCommunityPost(postId, body);
    void request
      .then((res) => {
        router.push(`/community/${res.data.id}`);
      })
      .catch((error: unknown) => {
        setErrorMessage(
          error instanceof ApiError
            ? error.message
            : '등록에 실패했습니다. 잠시 후 다시 시도해주세요.',
        );
        setPending(false);
      });
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{isEdit ? '글 수정' : '글쓰기'}</h1>
      <p className={styles.subtitle}>
        커뮤니티 규칙을 지켜주세요. 상업·광고 목적 개인정보는 자동 필터됩니다.
      </p>

      <div className={styles.categories}>
        {WRITE_CATEGORIES.map((item) => (
          <button
            key={item.id}
            type="button"
            className={clsx(
              styles.categoryChip,
              category === item.id && styles.categoryChipActive,
            )}
            onClick={() => {
              setCategory(item.id);
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <input
        type="text"
        className={styles.titleInput}
        placeholder="제목을 입력해주세요"
        maxLength={TITLE_MAX}
        value={title}
        onChange={(event) => {
          setTitle(event.target.value);
        }}
      />

      <RichTextEditor
        value={content}
        onChange={setContent}
        placeholder="본문을 작성해주세요"
        bodyHeight={418}
      />

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={() => {
            router.push('/community');
          }}
        >
          취소
        </button>
        <button
          type="button"
          className={clsx(
            styles.submitButton,
            !canSubmit && styles.submitButtonDisabled,
          )}
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          {isEdit ? '수정' : '등록'}
        </button>
      </div>

      <Modal
        isOpen={errorMessage !== null}
        onClose={() => {
          setErrorMessage(null);
        }}
        maxWidth={360}
      >
        <div className={styles.errorModal}>
          <CircleAlert size={24} className={styles.errorIcon} aria-hidden />
          <p className={styles.errorText}>
            {errorMessage}
            {'\n'}
            수정하고 다시 등록해주세요.
          </p>
          <button
            type="button"
            className={styles.errorButton}
            onClick={() => {
              setErrorMessage(null);
            }}
          >
            예
          </button>
        </div>
      </Modal>
    </div>
  );
}
