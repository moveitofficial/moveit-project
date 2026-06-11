'use client';

import { type ChangeEvent, type FormEvent, useState } from 'react';

import {
  toUpdatePasswordErrorMessage,
  useAdminPasswordChange,
} from '../useAdminPasswordChange';

import * as styles from './PasswordResetForm.css';

export default function PasswordResetForm() {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    newPasswordConfirm: '',
  });

  const { mutate, isPending, error, reset } = useAdminPasswordChange();

  const isPasswordMismatch =
    form.newPassword !== '' &&
    form.newPasswordConfirm !== '' &&
    form.newPassword !== form.newPasswordConfirm;

  const serverErrorMessage = toUpdatePasswordErrorMessage(error);
  const errorMessage = isPasswordMismatch
    ? '새 비밀번호가 일치하지 않습니다.'
    : serverErrorMessage;

  const canSubmit =
    form.currentPassword.trim() !== '' &&
    form.newPassword.trim() !== '' &&
    form.newPasswordConfirm.trim() !== '' &&
    !isPasswordMismatch &&
    !isPending;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (serverErrorMessage !== null) reset();
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;
    mutate(form);
  };

  return (
    <form className={styles.FormContainer} onSubmit={handleSubmit} noValidate>
      <div className={styles.InputItemWrapperWithMargin}>
        <label htmlFor="currentPassword" className={styles.InputLabel}>
          현재 비밀번호
        </label>
        <input
          id="currentPassword"
          type="password"
          name="currentPassword"
          placeholder="현재 비밀번호를 입력해주세요"
          value={form.currentPassword}
          onChange={handleChange}
          className={styles.InputItem}
        />
      </div>

      <div className={styles.InputItemWrapperWithMargin}>
        <label htmlFor="newPassword" className={styles.InputLabel}>
          변경할 비밀번호
        </label>
        <input
          id="newPassword"
          type="password"
          name="newPassword"
          placeholder="변경할 비밀번호를 입력해주세요"
          value={form.newPassword}
          onChange={handleChange}
          className={styles.InputItem}
        />
      </div>

      <div className={styles.InputItemWrapper}>
        <label htmlFor="newPasswordConfirm" className={styles.InputLabel}>
          한번더 입력
        </label>
        <input
          id="newPasswordConfirm"
          type="password"
          name="newPasswordConfirm"
          placeholder="변경할 비밀번호를 한번더 입력해주세요"
          value={form.newPasswordConfirm}
          onChange={handleChange}
          className={styles.InputItem}
        />
        {errorMessage !== null && (
          <p className={styles.ErrorMessage}>{errorMessage}</p>
        )}
      </div>

      <button
        type="submit"
        className={styles.ChangePasswordBtn}
        disabled={!canSubmit}
      >
        비밀번호 변경
      </button>
    </form>
  );
}
