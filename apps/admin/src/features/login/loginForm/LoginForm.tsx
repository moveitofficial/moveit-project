'use client';

import { type ChangeEvent, type FormEvent, useState } from 'react';

import { toSignInErrorMessage, useAdminSignIn } from '../useAdminSignIn';

import * as styles from './LoginForm.css';

export default function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { mutate, isPending, error, reset } = useAdminSignIn();

  const errorMessage = toSignInErrorMessage(error);

  const canSubmit =
    form.email.trim() !== '' && form.password.trim() !== '' && !isPending;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (errorMessage !== null) reset();
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;
    mutate(form);
  };

  return (
    <form className={styles.FormContainer} onSubmit={handleSubmit} noValidate>
      <div className={styles.FirstInputItem}>
        <label htmlFor="email" className={styles.InputLabel}>
          이메일
        </label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="이메일을 입력하세요"
          value={form.email}
          onChange={handleChange}
          className={styles.InputItem}
        />
        {errorMessage !== null && (
          <p className={styles.ErrorMessage}>{errorMessage}</p>
        )}
      </div>

      <div className={styles.InputItemWrapper}>
        <label htmlFor="password" className={styles.InputLabel}>
          비밀번호
        </label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="비밀번호를 입력해주세요"
          value={form.password}
          onChange={handleChange}
          className={styles.InputItem}
        />
        {errorMessage !== null && (
          <p className={styles.ErrorMessage}>{errorMessage}</p>
        )}
      </div>

      <button type="submit" className={styles.LoginBtn} disabled={!canSubmit}>
        로그인
      </button>
    </form>
  );
}
