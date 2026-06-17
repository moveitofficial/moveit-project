'use client';

import { Modal } from '@repo/ui/Modal';
import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';

import * as styles from './TradeRequestModal.css';

import type { MessageRoomInfoService } from '@/feature/message/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  service: MessageRoomInfoService;
  isSubmitting: boolean;
  onSubmit: (agreedServicePrice: number) => void;
}

export default function TradeRequestModal({
  isOpen,
  onClose,
  service,
  isSubmitting,
  onSubmit,
}: Props) {
  const [amount, setAmount] = useState('');

  const numericAmount = amount.length > 0 ? Number(amount) : 0;
  const canSubmit = numericAmount > 0 && !isSubmitting;
  const display = numericAmount > 0 ? numericAmount.toLocaleString() : '';

  const handleClose = () => {
    setAmount('');
    onClose();
  };

  const handleSubmit = () => {
    if (!canSubmit) {
      return;
    }
    onSubmit(numericAmount);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth={420}>
      <div className={styles.content}>
        <h2 className={styles.title}>moveit 결제 요청</h2>

        <div className={styles.serviceCard}>
          {service.thumbnailUrl === undefined ? (
            <div className={styles.thumbnail} aria-hidden />
          ) : (
            <Image
              src={service.thumbnailUrl}
              alt=""
              width={56}
              height={56}
              unoptimized
              className={styles.thumbnailImage}
            />
          )}
          <div className={styles.serviceInfo}>
            <p className={styles.serviceTitle}>{service.title}</p>
            <p className={styles.servicePrice}>
              {service.servicePrice.toLocaleString()} 원
            </p>
          </div>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>서비스금액</span>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              inputMode="numeric"
              className={styles.input}
              value={display}
              onChange={(event) => {
                setAmount(event.target.value.replaceAll(/\D/g, ''));
              }}
              placeholder="0"
            />
            <span className={styles.unit}>원</span>
          </div>
        </div>

        <div className={styles.footer}>
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
            결제 요청하기
          </button>
        </div>
      </div>
    </Modal>
  );
}
