'use client';

import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import * as styles from './FaqForm.css';

import { createFaq } from '@/features/faq/api';
import { RichTextEditor } from '@/features/faq/RichTextEditor';

const TITLE_MAX = 200;

// 태그 제거 후 실제 텍스트가 비어있는지(에디터 빈 본문 판별).
const isContentEmpty = (html: string): boolean =>
  html.replaceAll(/<[^>]*>/g, '').trim() === '';

export default function FaqForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
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
    void createFaq({ title: title.trim(), content })
      .then(() => {
        router.push('/faqs');
        router.refresh();
      })
      .catch(() => {
        alert('등록 중 오류가 발생했습니다.');
        setPending(false);
      });
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>FAQ 등록</h2>

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
        bodyHeight={360}
      />

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={() => {
            router.push('/faqs');
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
          등록
        </button>
      </div>
    </div>
  );
}
