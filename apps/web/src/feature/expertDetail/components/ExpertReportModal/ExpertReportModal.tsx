'use client';

import reportAlertIcon from '@public/expertDetail/reportAlert.svg';
import { ApiError } from '@repo/fetcher';
import { Modal, ModalBody, ModalFooter } from '@repo/ui/Modal';
import clsx from 'clsx';
import { Paperclip, X } from 'lucide-react';
import Image from 'next/image';
import { useId, useRef, useState, type ChangeEvent } from 'react';

import { createExpertReport, uploadReportImages } from '../../api';
import {
  EXPERT_REPORT_MAX_FILE_SIZE_BYTES,
  EXPERT_REPORT_MAX_FILES,
  EXPERT_REPORT_MIN_DETAIL_LENGTH,
  EXPERT_REPORT_REASON_OPTIONS,
} from '../../constants';

import * as styles from './ExpertReportModal.css';

import type { ExpertReportReason } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  reportedUserId: string;
}

export default function ExpertReportModal({
  isOpen,
  onClose,
  reportedUserId,
}: Props) {
  const titleId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [reason, setReason] = useState<ExpertReportReason | null>(null);
  const [detail, setDetail] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [agreed, setAgreed] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trimmedDetail = detail.trim();
  const canSubmit =
    reason !== null &&
    trimmedDetail.length >= EXPERT_REPORT_MIN_DETAIL_LENGTH &&
    agreed &&
    !isSubmitting;

  const resetForm = () => {
    setReason(null);
    setDetail('');
    setFiles([]);
    setAgreed(false);
    setErrorMessage(null);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files;
    if (selected === null) {
      return;
    }

    const nextFiles: File[] = [];
    for (const file of selected) {
      if (file.size > EXPERT_REPORT_MAX_FILE_SIZE_BYTES) {
        continue;
      }
      nextFiles.push(file);
    }

    setFiles((prev) =>
      [...prev, ...nextFiles].slice(0, EXPERT_REPORT_MAX_FILES),
    );
    event.target.value = '';
  };

  const handleSubmit = () => {
    if (
      reason === null ||
      trimmedDetail.length < EXPERT_REPORT_MIN_DETAIL_LENGTH ||
      !agreed ||
      isSubmitting
    ) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    void (async () => {
      try {
        let reportId: string | undefined;
        let imageUrls: string[] | undefined;

        if (files.length > 0) {
          const uploadResult = await uploadReportImages(files);
          reportId = uploadResult.reportId;
          imageUrls = uploadResult.images.map((image) => image.url);
        }

        await createExpertReport({
          reportId,
          reportedUserId,
          reason,
          detail: trimmedDetail,
          imageUrls,
        });

        handleClose();
      } catch (error) {
        setErrorMessage(
          error instanceof ApiError
            ? error.message
            : '신고 접수에 실패했습니다. 로그인 상태를 확인해 주세요.',
        );
        setIsSubmitting(false);
      }
    })();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth={560}
      labelledBy={titleId}
    >
      <ModalBody className={styles.scrollBody}>
        <h2 id={titleId} className={styles.title}>
          <Image
            src={reportAlertIcon}
            alt=""
            width={24}
            height={24}
            className={styles.titleIcon}
            aria-hidden
          />
          신고하기
        </h2>

        <p className={styles.fieldLabel}>사유를 선택해주세요</p>
        <div className={styles.reasonGrid}>
          {EXPERT_REPORT_REASON_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={clsx(
                styles.reasonOption,
                reason === option.value && styles.reasonOptionSelected,
              )}
            >
              <input
                type="radio"
                name="report-reason"
                value={option.value}
                checked={reason === option.value}
                onChange={() => {
                  setReason(option.value);
                }}
              />
              {option.label}
            </label>
          ))}
        </div>

        <p className={styles.fieldLabel}>상세내용</p>
        <textarea
          className={styles.textarea}
          placeholder="구체적인 상황을 적어주세요 (10자 이상)"
          value={detail}
          onChange={(event) => {
            setDetail(event.target.value);
          }}
        />

        <p className={styles.fieldLabel}>증거 파일</p>
        <button
          type="button"
          className={styles.attachButton}
          onClick={() => {
            fileInputRef.current?.click();
          }}
        >
          <Paperclip size={16} />
          파일 첨부
        </button>
        <p className={styles.attachHint}>
          최대 {String(EXPERT_REPORT_MAX_FILES)}개 · 각 5MB
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className={styles.hiddenFileInput}
          onChange={handleFileSelect}
        />

        {files.length > 0 ? (
          <ul className={styles.filePreviewList}>
            {files.map((file, index) => (
              <li key={`${file.name}-${String(index)}`} className={styles.filePreviewItem}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className={styles.filePreviewImage}
                />
                <button
                  type="button"
                  className={styles.fileRemoveButton}
                  aria-label={`${file.name} 삭제`}
                  onClick={() => {
                    setFiles((prev) => prev.filter((_, i) => i !== index));
                  }}
                >
                  <X size={12} />
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        <div className={styles.agreementBox}>
          <label className={styles.agreementLabel}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(event) => {
                setAgreed(event.target.checked);
              }}
            />
            허위 신고 시 서비스 이용을 제한 받을 수 있음에 동의합니다.
          </label>
        </div>

        {errorMessage === null ? null : (
          <p className={styles.errorMessage} role="alert">
            {errorMessage}
          </p>
        )}
      </ModalBody>

      <ModalFooter className={styles.footer}>
        <button type="button" className={styles.cancelButton} onClick={handleClose}>
          취소
        </button>
        <button
          type="button"
          className={clsx(
            styles.submitButton,
            canSubmit ? undefined : styles.submitButtonDisabled,
          )}
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          신고 접수
        </button>
      </ModalFooter>
    </Modal>
  );
}
