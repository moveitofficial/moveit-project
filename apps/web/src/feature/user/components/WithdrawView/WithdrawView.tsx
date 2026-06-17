'use client';

import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { toWithdrawErrorMessage, useWithdraw } from '../../useWithdraw';

import * as styles from './WithdrawView.css';

const WITHDRAW_REASON_MAX_LENGTH = 200;

export default function WithdrawView() {
  const router = useRouter();
  const { mutate, isPending, error, reset } = useWithdraw();
  const [reason, setReason] = useState('');

  const trimmedReason = reason.trim();
  const errorMessage = toWithdrawErrorMessage(error);
  const hasError = errorMessage !== null;
  const canSubmit = trimmedReason.length > 0 && !isPending;

  const handleReasonChange = (value: string) => {
    if (hasError) reset();
    setReason(value);
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    mutate(trimmedReason);
  };

  return (
    <section className={styles.container}>
      <h1 className={styles.pageTitle}>회원탈퇴</h1>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>안내사항</h2>
        <ol className={styles.noticeList}>
          <li>탈퇴 처리시, 작성한 게시글·댓글·리뷰는 삭제 처리됩니다.</li>
          <li>거래 이력 및 정산 관련 데이터는 관련 법령에 따라 일정 기간 보관됩니다.</li>
          <li>진행 중인 거래(결제 완료~구매확정 전)가 있는 경우 탈퇴가 제한됩니다.</li>
          <li>동일 이메일로 재가입 불가합니다.</li>
        </ol>
      </div>

      <div className={styles.card}>
        <div className={styles.reasonSection}>
          <label htmlFor="withdraw-reason" className={styles.cardTitle}>
            탈퇴 사유
          </label>
          <textarea
            id="withdraw-reason"
            className={styles.textarea}
            placeholder="탈퇴 사유를 입력해주세요"
            value={reason}
            maxLength={WITHDRAW_REASON_MAX_LENGTH}
            disabled={isPending}
            onChange={(e) => {
              handleReasonChange(e.target.value);
            }}
          />
          {hasError ? <p className={styles.errorMessage}>{errorMessage}</p> : null}
        </div>
        <div className={styles.buttonGroup}>
          <button
            type="button"
            className={styles.cancelButton}
            disabled={isPending}
            onClick={() => {
              router.back();
            }}
          >
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
            탈퇴하기
          </button>
        </div>
      </div>
    </section>
  );
}
