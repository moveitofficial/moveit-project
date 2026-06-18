'use client';

import { ApiError } from '@repo/fetcher';
import { Modal } from '@repo/ui/Modal';
import clsx from 'clsx';
import { Paperclip, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useId, useRef, useState, type ChangeEvent } from 'react';

import {
  createConsultationRoom,
  uploadConsultationFiles,
} from '../../api';
import {
  CONSULTATION_INQUIRY_ACCEPT,
  CONSULTATION_INQUIRY_MAX_FILES,
  CONSULTATION_INQUIRY_MAX_FILE_SIZE_BYTES,
  CONSULTATION_INQUIRY_MODAL_MAX_WIDTH,
  CONSULTATION_INQUIRY_PLACEHOLDER,
} from '../../constants';

import * as styles from './ConsultationInquiryModal.css';

import type {
  ConsultationChatFile,
  ConsultationInquiryContext,
} from '../../types';


interface Props {
  isOpen: boolean;
  onClose: () => void;
  context: ConsultationInquiryContext;
  // 전송 성공 시 생성된 채팅방 id 전달(성공 모달·이동용). 없으면 닫기만.
  onSubmitSuccess?: (roomId: string) => void;
}

function getExpertInitials(companyName: string): string {
  return companyName.replaceAll(' ', '').slice(0, 2);
}

function isImageFile(file: File): boolean {
  return file.type === 'image/png' || file.type === 'image/jpeg';
}

export default function ConsultationInquiryModal({
  isOpen,
  onClose,
  context,
  onSubmitSuccess,
}: Props) {
  const textareaId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 선택한 파일의 미리보기 URL을 만들고, 변경/언마운트 시 해제한다.
  useEffect(() => {
    const urls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
    return () => {
      for (const url of urls) {
        URL.revokeObjectURL(url);
      }
    };
  }, [selectedFiles]);

  const trimmedContent = content.trim();
  const canSubmit = trimmedContent.length > 0 && !isSubmitting;

  const resetForm = () => {
    setContent('');
    setSelectedFiles([]);
    setErrorMessage(null);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files === null) {
      return;
    }

    const nextFiles: File[] = [];
    for (const file of files) {
      if (!isImageFile(file)) {
        setErrorMessage('JPG, PNG 이미지만 첨부할 수 있습니다.');
        continue;
      }
      if (file.size > CONSULTATION_INQUIRY_MAX_FILE_SIZE_BYTES) {
        setErrorMessage('파일 크기는 각 500MB 이하여야 합니다.');
        continue;
      }
      nextFiles.push(file);
    }

    setSelectedFiles((prev) => {
      const merged = [...prev, ...nextFiles].slice(0, CONSULTATION_INQUIRY_MAX_FILES);
      if (prev.length + nextFiles.length > CONSULTATION_INQUIRY_MAX_FILES) {
        setErrorMessage(`파일은 최대 ${CONSULTATION_INQUIRY_MAX_FILES.toString()}개까지 첨부할 수 있습니다.`);
      }
      return merged;
    });

    event.target.value = '';
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, fileIndex) => fileIndex !== index));
    setErrorMessage(null);
  };

  const handleSubmit = () => {
    if (!canSubmit) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    void (async () => {
      try {
        let roomId: string | undefined;
        let uploadedFiles: ConsultationChatFile[] | undefined;

        if (selectedFiles.length > 0) {
          const uploadResult = await uploadConsultationFiles(selectedFiles);
          roomId = uploadResult.roomId;
          uploadedFiles = uploadResult.files;
        }

        const created = await createConsultationRoom({
          expertUserId: context.expertUserId,
          serviceId: context.serviceId,
          content: trimmedContent,
          roomId,
          files: uploadedFiles,
        });

        handleClose();
        onSubmitSuccess?.(created.id);
      } catch (error) {
        setErrorMessage(
          error instanceof ApiError
            ? error.message
            : '문의 전송에 실패했습니다. 로그인 상태를 확인해 주세요.',
        );
        setIsSubmitting(false);
      }
    })();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth={CONSULTATION_INQUIRY_MODAL_MAX_WIDTH}
      labelledBy={textareaId}
    >
      <div className={styles.content}>
        <div className={styles.expertBanner}>
          <div className={styles.expertAvatar}>
            {getExpertInitials(context.companyName)}
          </div>
          <div className={styles.expertInfo}>
            <p className={styles.expertName}>{context.companyName}</p>
            <p className={styles.expertHours}>
              연락 가능시간 : 평일 {context.contactTime.start} ~{' '}
              {context.contactTime.end}
            </p>
          </div>
        </div>

        <textarea
          id={textareaId}
          className={styles.textarea}
          placeholder={CONSULTATION_INQUIRY_PLACEHOLDER}
          value={content}
          onChange={(event) => {
            setContent(event.target.value);
          }}
        />

        <div className={styles.bottomSection}>
          <div className={styles.attachGroup}>
            <button
              type="button"
              className={clsx(
                styles.attachButton,
                selectedFiles.length >= CONSULTATION_INQUIRY_MAX_FILES &&
                  styles.attachButtonDisabled,
              )}
              onClick={() => {
                fileInputRef.current?.click();
              }}
              disabled={selectedFiles.length >= CONSULTATION_INQUIRY_MAX_FILES}
            >
              <Paperclip size={16} />
              파일 첨부
            </button>
            <p className={styles.attachHint}>최대 3개 · 각 500MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept={CONSULTATION_INQUIRY_ACCEPT}
              className={styles.hiddenFileInput}
              multiple
              onChange={handleFileSelect}
            />
          </div>

          {selectedFiles.length > 0 ? (
            <ul className={styles.fileList}>
              {selectedFiles.map((file, index) => {
                const previewUrl = previewUrls[index];

                return (
                  <li
                    key={`${file.name}-${String(index)}`}
                    className={styles.thumbnail}
                  >
                    {previewUrl === undefined ? null : (
                      <Image
                        src={previewUrl}
                        alt={file.name}
                        width={100}
                        height={100}
                        unoptimized
                        className={styles.thumbnailImage}
                      />
                    )}
                    <button
                      type="button"
                      className={styles.thumbnailRemove}
                      onClick={() => {
                        handleRemoveFile(index);
                      }}
                      aria-label={`${file.name} 삭제`}
                    >
                      <X size={14} />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}

          {errorMessage === null ? null : (
            <p className={styles.errorMessage}>{errorMessage}</p>
          )}

          <div className={styles.footer}>
            <button type="button" className={styles.cancelButton} onClick={handleClose}>
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
              문의하기
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
