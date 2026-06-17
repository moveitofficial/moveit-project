'use client';

import { ApiError } from '@repo/fetcher';
import { useRouter } from 'next/navigation';
import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';

import * as styles from './ChangePasswordView.css';

import { PASSWORD_REGEX } from '@/feature/signup/components/EmailCredentials/constants';
import {
  useChangePasswordMutation,
  useMyUserQuery,
} from '@/feature/user/queries';

interface FormState {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

function ChangePasswordForm() {
  const router = useRouter();
  const { mutate, isPending, error, reset } = useChangePasswordMutation();

  const [form, setForm] = useState<FormState>({
    currentPassword: '',
    newPassword: '',
    newPasswordConfirm: '',
  });

  const newPasswordError =
    form.newPassword.length > 0 && !PASSWORD_REGEX.test(form.newPassword)
      ? '영문 대·소문자, 숫자, 특수문자를 포함한 8자 이상으로 입력해 주세요'
      : null;
  const passwordConfirmError =
    form.newPasswordConfirm.length > 0 &&
    form.newPassword !== form.newPasswordConfirm
      ? '비밀번호가 일치하지 않습니다.'
      : null;

  const apiErrorMessage = error instanceof ApiError ? error.message : null;
  const currentPasswordError =
    apiErrorMessage === '현재 비밀번호가 일치하지 않습니다.'
      ? apiErrorMessage
      : null;
  const apiPasswordConfirmError =
    apiErrorMessage === '새 비밀번호가 일치하지 않습니다.'
      ? apiErrorMessage
      : null;
  const confirmError = passwordConfirmError ?? apiPasswordConfirmError;
  const formError =
    apiErrorMessage !== null &&
    currentPasswordError === null &&
    apiPasswordConfirmError === null
      ? apiErrorMessage
      : null;

  const canSubmit =
    form.currentPassword.trim() !== '' &&
    form.newPassword.trim() !== '' &&
    newPasswordError === null &&
    form.newPasswordConfirm.trim() !== '' &&
    passwordConfirmError === null;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    reset();
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || isPending) return;

    mutate(
      {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
        newPasswordConfirm: form.newPasswordConfirm,
      },
      {
        onSuccess: () => {
          router.push('/mypage');
        },
      },
    );
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.card}>
        <div className={styles.currentPasswordField}>
          <label htmlFor="current-password" className={styles.label}>
            현재 비밀번호
          </label>
          <div className={styles.passwordWrapper}>
            <input
              id="current-password"
              type="password"
              name="currentPassword"
              autoComplete="off"
              placeholder="현재 비밀번호를 입력해주세요"
              value={form.currentPassword}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
          {currentPasswordError !== null && (
            <p className={styles.currentPasswordFieldError}>
              {currentPasswordError}
            </p>
          )}
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label htmlFor="new-password" className={styles.label}>
              변경할 비밀번호
            </label>
            <div className={styles.passwordWrapper}>
              <input
                id="new-password"
                type="password"
                name="newPassword"
                autoComplete="new-password"
                placeholder="변경할 비밀번호를 입력해주세요"
                value={form.newPassword}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            {newPasswordError !== null && (
              <p className={styles.fieldError}>{newPasswordError}</p>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="new-password-confirm" className={styles.label}>
              한번더 입력
            </label>
            <div className={styles.passwordWrapper}>
              <input
                id="new-password-confirm"
                type="password"
                name="newPasswordConfirm"
                autoComplete="new-password"
                placeholder="변경할 비밀번호를 한번더 입력해주세요"
                value={form.newPasswordConfirm}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            {confirmError !== null && (
              <p className={styles.fieldError}>{confirmError}</p>
            )}
          </div>
        </div>

        {formError !== null && <p className={styles.formError}>{formError}</p>}

        <div className={styles.buttonGroup}>
          <button
            type="submit"
            className={
              canSubmit && !isPending
                ? styles.submitButton
                : `${styles.submitButton} ${styles.submitButtonDisabled}`
            }
            disabled={!canSubmit || isPending}
          >
            변경하기
          </button>
        </div>
      </div>
    </form>
  );
}

export default function ChangePasswordView() {
  const router = useRouter();
  const { data: user, isPending, isError, error } = useMyUserQuery();

  useEffect(() => {
    if (error instanceof ApiError && error.status === 401) {
      router.push('/login');
    }
  }, [error, router]);

  if (isPending) {
    return (
      <section className={styles.container}>
        <h1 className={styles.pageTitle}>비밀번호 변경</h1>
        <p className={styles.statusMessage}>내 정보를 불러오는 중입니다.</p>
      </section>
    );
  }

  if (isError) {
    const message =
      error instanceof ApiError
        ? error.message
        : '내 정보를 불러오지 못했습니다.';
    return (
      <section className={styles.container}>
        <h1 className={styles.pageTitle}>비밀번호 변경</h1>
        <p className={styles.errorMessage}>{message}</p>
      </section>
    );
  }

  const isSocialAccount = user.provider !== 'LOCAL';

  return (
    <section className={styles.container}>
      <h1 className={styles.pageTitle}>비밀번호 변경</h1>

      {isSocialAccount ? (
        <div className={styles.noticeCard}>
          <p className={styles.noticeText}>
            소셜 로그인 계정은 비밀번호를 변경할 수 없습니다.
          </p>
        </div>
      ) : (
        <ChangePasswordForm />
      )}
    </section>
  );
}
