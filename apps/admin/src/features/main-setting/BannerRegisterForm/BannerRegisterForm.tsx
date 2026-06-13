'use client';

import { typography } from '@repo/styles/typography';
import { Modal } from '@repo/ui/Modal';
import { ImagePlus } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';

import * as styles from './BannerRegisterForm.css';

import type { ChangeEvent } from 'react';

import { registerBanner } from '@/features/main-setting/actions';

interface Props {
  onClose: () => void;
}

export default function BannerRegisterForm({ onClose }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [actionUrl, setActionUrl] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    if (selected === null) return;
    if (preview !== null) URL.revokeObjectURL(preview);
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  async function handleSubmit() {
    if (file === null || actionUrl.trim().length === 0) return;
    setIsPending(true);
    setErrorMessage(null);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('actionUrl', actionUrl.trim());
    try {
      await registerBanner(formData);
      onClose();
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : '배너 등록에 실패했습니다.',
      );
    } finally {
      setIsPending(false);
    }
  }

  const isValid = file !== null && actionUrl.trim().length > 0;

  return (
    <Modal isOpen={true} onClose={onClose} maxWidth={720}>
      <div className={styles.header}>
        <h2 className={`${typography.f18B} ${styles.title}`}>띠배너 등록</h2>
      </div>

      <input
        ref={inputRef}
        id="banner-file-input"
        type="file"
        accept="image/*"
        className={styles.fileInput}
        onChange={handleFileChange}
      />

      <div className={styles.body}>
        {preview === null ? (
          <label htmlFor="banner-file-input" className={styles.uploadArea}>
            <ImagePlus
              className={styles.uploadSvgIcon}
              size={24}
              aria-hidden="true"
            />
            <span className={`${typography.f14R} ${styles.uploadText}`}>
              띠배너 이미지등록 권장크기(1176px * 164px)
            </span>
          </label>
        ) : (
          <label htmlFor="banner-file-input" className={styles.previewWrapper}>
            <Image
              src={preview}
              alt="배너 미리보기"
              unoptimized
              width={1176}
              height={164}
              className={styles.previewImage}
            />
          </label>
        )}

        <div className={styles.fieldGroup}>
          <label className={`${typography.f16B} ${styles.label}`} htmlFor="banner-action-url">
            URL 입력
          </label>
          <input
            id="banner-action-url"
            type="text"
            className={`${typography.f16R} ${styles.input}`}
            placeholder="URL을 입력해주세요"
            value={actionUrl}
            onChange={(e) => {
              setActionUrl(e.target.value);
            }}
          />
        </div>

        {errorMessage !== null && (
          <p className={`${typography.f14R} ${styles.errorText}`}>{errorMessage}</p>
        )}
      </div>

      <div className={styles.footer}>
        <button
          type="button"
          className={`${typography.f16B} ${styles.submitButton}`}
          disabled={!isValid || isPending}
          onClick={() => {
            void handleSubmit();
          }}
        >
          띠배너 등록
        </button>
        <button type="button" className={`${typography.f16R} ${styles.cancelButton}`} onClick={onClose}>
          취소
        </button>
      </div>
    </Modal>
  );
}
