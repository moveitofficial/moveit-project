'use client';

import { Modal } from '@repo/ui/Modal';
import clsx from 'clsx';
import { Check, Paperclip, TriangleAlert, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import * as styles from './ReportModal.css';

import type { ReportReason } from '@/feature/message/api';
import type { ChangeEvent } from 'react';

const REASONS: { value: ReportReason; label: string }[] = [
  { value: 'FALSE_INFORMATION', label: '허위·과장 정보' },
  { value: 'ABUSE', label: '욕설·비방' },
  { value: 'ILLEGAL_ACTIVITY', label: '불법 행위/사기 의심' },
  { value: 'EXTERNAL_CONTACT', label: '외부 연락처 유도' },
  { value: 'SPAM', label: '스팸/광고' },
  { value: 'OTHER', label: '기타' },
];

const MAX_FILES = 3;
const MAX_SIZE = 5 * 1024 * 1024;

interface EvidenceFile {
  file: File;
  preview: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isSubmitting: boolean;
  onSubmit: (params: {
    reason: ReportReason;
    detail: string;
    files: File[];
  }) => void;
}

export default function ReportModal({
  isOpen,
  onClose,
  isSubmitting,
  onSubmit,
}: Props) {
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [detail, setDetail] = useState('');
  const [files, setFiles] = useState<EvidenceFile[]>([]);
  const [agreed, setAgreed] = useState(false);

  const canSubmit =
    reason !== null && detail.trim().length >= 10 && agreed && !isSubmitting;

  const reset = () => {
    for (const item of files) {
      URL.revokeObjectURL(item.preview);
    }
    setReason(null);
    setDetail('');
    setFiles([]);
    setAgreed(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = [...(event.target.files ?? [])];
    event.target.value = '';
    const valid = selected.filter(
      (file) => file.type.startsWith('image/') && file.size <= MAX_SIZE,
    );
    setFiles((prev) =>
      [
        ...prev,
        ...valid.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
        })),
      ].slice(0, MAX_FILES),
    );
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const target = prev[index];
      if (target !== undefined) {
        URL.revokeObjectURL(target.preview);
      }
      return prev.filter((_, current) => current !== index);
    });
  };

  const handleSubmit = () => {
    if (reason === null || !canSubmit) {
      return;
    }
    onSubmit({
      reason,
      detail: detail.trim(),
      files: files.map((item) => item.file),
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth={560}>
      <div className={styles.content}>
        <div className={styles.titleRow}>
          <span className={styles.titleIcon}>
            <TriangleAlert size={16} aria-hidden />
          </span>
          <h2 className={styles.title}>신고하기</h2>
        </div>

        <span className={styles.label}>사유를 선택해주세요</span>
        <div className={styles.reasonGrid}>
          {REASONS.map(({ value, label }) => {
            const active = reason === value;
            return (
              <button
                key={value}
                type="button"
                className={clsx(
                  styles.reasonOption,
                  active && styles.reasonOptionActive,
                )}
                onClick={() => {
                  setReason(value);
                }}
              >
                <span className={clsx(styles.radio, active && styles.radioActive)}>
                  {active ? <span className={styles.radioDot} /> : null}
                </span>
                {label}
              </button>
            );
          })}
        </div>

        <span className={styles.label}>상세내용</span>
        <textarea
          className={styles.textarea}
          value={detail}
          onChange={(event) => {
            setDetail(event.target.value);
          }}
          placeholder="구체적인 상황을 적어주세요 (10자 이상)"
        />
        {detail.trim().length > 0 && detail.trim().length < 10 ? (
          <span className={styles.hint}>
            최소 10자 이상 입력해주세요. ({detail.trim().length}/10)
          </span>
        ) : null}

        <div className={styles.fileRow}>
          <label
            className={clsx(
              styles.fileButton,
              files.length >= MAX_FILES && styles.fileButtonDisabled,
            )}
          >
            <Paperclip size={16} aria-hidden />
            증거 파일
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.webp"
              multiple
              hidden
              disabled={files.length >= MAX_FILES}
              onChange={handleFileChange}
            />
          </label>
          <span className={styles.fileHint}>최대 3개 · 각 5MB</span>
        </div>
        {files.length > 0 ? (
          <div className={styles.thumbs}>
            {files.map((item, index) => (
              <div key={item.preview} className={styles.thumb}>
                <Image
                  src={item.preview}
                  alt=""
                  width={64}
                  height={64}
                  unoptimized
                  className={styles.thumbImage}
                />
                <button
                  type="button"
                  className={styles.thumbRemove}
                  onClick={() => {
                    removeFile(index);
                  }}
                  aria-label="삭제"
                >
                  <X size={14} aria-hidden />
                </button>
              </div>
            ))}
          </div>
        ) : null}

        <button
          type="button"
          className={styles.agreement}
          onClick={() => {
            setAgreed((prev) => !prev);
          }}
        >
          <span className={clsx(styles.checkbox, agreed && styles.checkboxChecked)}>
            {agreed ? <Check size={12} aria-hidden /> : null}
          </span>
          허위 신고 시 서비스 이용을 제한 받을 수 있음에 동의합니다.
        </button>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={handleClose}
          >
            취소
          </button>
          <button
            type="button"
            className={clsx(
              styles.submitButton,
              canSubmit ? undefined : styles.submitButtonDisabled,
            )}
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            신고 접수
          </button>
        </div>
      </div>
    </Modal>
  );
}
