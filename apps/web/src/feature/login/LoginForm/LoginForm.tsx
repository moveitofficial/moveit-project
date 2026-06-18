'use client';

import clsx from 'clsx';
import { type ChangeEvent, type FormEvent, useState } from 'react';

import { toSignInErrorMessage, useSignIn } from '../useSignIn';

import * as styles from './LoginForm.css';

export default function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { mutate, isPending, error, reset } = useSignIn();

  const errorMessage = toSignInErrorMessage(error);
  const hasError = errorMessage !== null;

  const canSubmit =
    form.email.trim() !== '' && form.password.trim() !== '' && !isPending;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (hasError) reset();
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;
    mutate(form);
  };

  return (
    <form
      className={styles.FormContainer}
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      <div className={styles.InputItemWrapper}>
        <label htmlFor="email" className={styles.InputLabel}>
          이메일
        </label>
        <input
          id="email"
          type="email"
          name="email"
          autoComplete="off"
          placeholder="이메일을 입력해주세요"
          value={form.email}
          onChange={handleChange}
          className={clsx(styles.InputItem, hasError && styles.InputItemError)}
        />
      </div>

      <div className={styles.InputItemWrapper}>
        <label htmlFor="password" className={styles.InputLabel}>
          비밀번호
        </label>
        <input
          id="password"
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder="비밀번호를 입력해주세요"
          value={form.password}
          onChange={handleChange}
          className={clsx(styles.InputItem, hasError && styles.InputItemError)}
        />
        {hasError && <p className={styles.ErrorMessage}>{errorMessage}</p>}
      </div>

      <button type="submit" className={styles.LoginBtn} disabled={!canSubmit}>
        로그인
      </button>
    </form>
  );
}
