'use client';

import { ApiError } from '@repo/fetcher';
import { Modal } from '@repo/ui/Modal';
import clsx from 'clsx';
import { Paperclip } from 'lucide-react';
import { useId, useRef, useState, type ChangeEvent } from 'react';

import { EXPERT_INQUIRY_MODAL_MAX_WIDTH } from '../../constants';
import { getExpertInitials } from '../../utils';

import * as styles from './ExpertInquiryModal.css';

import type { ExpertInquiryServiceOption } from '../../types';
import type { ConsultationChatFile } from '@/feature/consultation/types';
import type { PortfolioModalExpertContext } from '@/feature/portfolioDetail/types';

import {
  createConsultationRoom,
  uploadConsultationFiles,
} from '@/feature/consultation/api';
import { ConsultationAttachedFileList } from '@/feature/consultation/components/ConsultationAttachedFileList';
import {
  CONSULTATION_INQUIRY_MAX_FILES,
  CONSULTATION_INQUIRY_MAX_FILE_SIZE_BYTES,
  CONSULTATION_INQUIRY_PLACEHOLDER,
} from '@/feature/consultation/constants';
import Dropdown from '@/feature/signup/components/common/Dropdown';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  expertUserId: string;
  expertContext: PortfolioModalExpertContext;
  services: ExpertInquiryServiceOption[];
  onSubmitSuccess: (roomId: string) => void;
}

export default function ExpertInquiryModal({
  isOpen,
  onClose,
  expertUserId,
  expertContext,
  services,
  onSubmitSuccess,
}: Props) {
  const textareaId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [serviceId, setServiceId] = useState('');
  const [content, setContent] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trimmedContent = content.trim();
  const canSubmit =
    serviceId.length > 0 && trimmedContent.length > 0 && !isSubmitting;
  const serviceOptions = services.map((service) => ({
    id: service.id,
    label: service.title,
  }));

  const resetForm = () => {
    setServiceId('');
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
      if (file.size <= CONSULTATION_INQUIRY_MAX_FILE_SIZE_BYTES) {
        nextFiles.push(file);
      }
    }

    setSelectedFiles((prev) =>
      [...prev, ...nextFiles].slice(0, CONSULTATION_INQUIRY_MAX_FILES),
    );
    event.target.value = '';
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
          expertUserId,
          serviceId,
          content: trimmedContent,
          roomId,
          files: uploadedFiles,
        });

        handleClose();
        onSubmitSuccess(created.id);
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
      maxWidth={EXPERT_INQUIRY_MODAL_MAX_WIDTH}
      labelledBy={textareaId}
    >
      <div className={styles.content}>
        <div className={styles.expertBanner}>
          <div className={styles.expertAvatar}>
            {getExpertInitials(expertContext.companyName)}
          </div>
          <div className={styles.expertInfo}>
            <p className={styles.expertName}>{expertContext.companyName}</p>
            <p className={styles.expertHours}>
              연락 가능시간 : 평일 {expertContext.contactTime.start} ~{' '}
              {expertContext.contactTime.end}
            </p>
          </div>
        </div>

        <Dropdown
          options={serviceOptions}
          value={serviceId}
          onChange={setServiceId}
          placeholder="문의할 서비스를 선택해주세요"
        />

        <textarea
          id={textareaId}
          className={styles.textarea}
          placeholder={CONSULTATION_INQUIRY_PLACEHOLDER}
          value={content}
          onChange={(event) => {
            setContent(event.target.value);
          }}
        />

        <div className={styles.attachGroup}>
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
          <p className={styles.attachHint}>최대 3개 · 각 500MB</p>
          <input
            ref={fileInputRef}
            type="file"
            className={styles.hiddenFileInput}
            multiple
            onChange={handleFileSelect}
          />
        </div>

        <ConsultationAttachedFileList
          files={selectedFiles}
          onRemove={(index) => {
            setSelectedFiles((prev) => prev.filter((_, fileIndex) => fileIndex !== index));
          }}
        />

        {errorMessage === null ? null : (
          <p className={styles.errorMessage} role="alert">
            {errorMessage}
          </p>
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
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            문의하기
          </button>
        </div>
      </div>
    </Modal>
  );
}
