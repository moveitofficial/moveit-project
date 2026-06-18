'use client';

import signupLogo from '@public/SignUp/signUpLogo.svg';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { type ChangeEvent, type FormEvent, useState } from 'react';

import { useEmailSignUp, toSignUpErrorMessage } from '../../useEmailSignUp';

import AgreeBox from './AgreeBox';
import {
  EMAIL_REGEX,
  PASSWORD_REGEX,
  type AgreementKey,
  type Agreements,
} from './constants';
import * as styles from './EmailCredentials.css';

interface Props {
  role: 'CLIENT' | 'EXPERT';
}

interface FormState {
  email: string;
  name: string;
  password: string;
  passwordConfirm: string;
}

export default function EmailCredentials({ role }: Props) {
  const { mutate, isPending, error } = useEmailSignUp();
  const errorMessage = toSignUpErrorMessage(error);
  const isExpert = role === 'EXPERT';

  const [form, setForm] = useState<FormState>({
    email: '',
    name: '',
    password: '',
    passwordConfirm: '',
  });
  const [agreements, setAgreements] = useState<Agreements>({
    age: false,
    terms: false,
    privacy: false,
    marketing: false,
  });
  const [passwordVisible, setPasswordVisible] = useState(false);

  const allAgreed = Object.values(agreements).every(Boolean);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleAgreement = (key: AgreementKey) => {
    setAgreements((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAll = () => {
    const next = !allAgreed;
    setAgreements({
      age: next,
      terms: next,
      privacy: next,
      marketing: next,
    });
  };

  const requiredAgreed = agreements.age && agreements.terms;

  const emailError =
    form.email.length > 0 && !EMAIL_REGEX.test(form.email)
      ? '이메일 주소가 올바르지 않아요'
      : null;
  const passwordError =
    form.password.length > 0 && !PASSWORD_REGEX.test(form.password)
      ? '영문 대·소문자, 숫자, 특수문자를 포함한 8자 이상으로 입력해 주세요'
      : null;
  const passwordConfirmError =
    form.passwordConfirm.length > 0 && form.password !== form.passwordConfirm
      ? '비밀번호가 일치하지 않습니다.'
      : null;

  const canSubmit =
    form.email.trim() !== '' &&
    emailError === null &&
    (isExpert || form.name.trim() !== '') &&
    form.password.trim() !== '' &&
    passwordError === null &&
    form.passwordConfirm.trim() !== '' &&
    passwordConfirmError === null &&
    requiredAgreed;

  const passwordType = passwordVisible ? 'text' : 'password';

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit || isPending) return;
    mutate({
      email: form.email,
      password: form.password,
      role,
      ...(isExpert ? {} : { name: form.name }), // 전문가는 name 생략
    });
  };

  return (
    <section className={styles.Container}>
      <div className={styles.titleWrapper}>
        <Image src={signupLogo} alt="moveit" priority />
        <h1 className={styles.title}>
          회원가입하고 새로운
          <br />
          가능성을 시작해 보세요
        </h1>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>
            이메일
          </label>
          <input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="이메일을 입력해주세요"
            value={form.email}
            onChange={handleChange}
            className={styles.input}
          />
          {emailError !== null && (
            <p className={styles.fieldError}>{emailError}</p>
          )}
        </div>

        {!isExpert && (
          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>
              이름
            </label>
            <input
              id="name"
              type="text"
              name="name"
              autoComplete="name"
              placeholder="이름을 입력해주세요"
              value={form.name}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
        )}

        <div className={styles.field}>
          <label htmlFor="password" className={styles.label}>
            비밀번호
          </label>
          <div className={styles.passwordWrapper}>
            <input
              id="password"
              type={passwordType}
              name="password"
              autoComplete="new-password"
              placeholder="영문, 숫자, 특수문자가 모두 들어간 8자이상"
              value={form.password}
              onChange={handleChange}
              className={styles.input}
            />
            <button
              type="button"
              onClick={() => {
                setPasswordVisible((v) => !v);
              }}
              className={styles.visibilityToggle}
              aria-label="비밀번호 표시"
            >
              {passwordVisible ? <Eye size={24} /> : <EyeOff size={24} />}
            </button>
          </div>
          {passwordError !== null && (
            <p className={styles.fieldError}>{passwordError}</p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="passwordConfirm" className={styles.label}>
            비밀번호 확인
          </label>
          <div className={styles.passwordWrapper}>
            <input
              id="passwordConfirm"
              type={passwordType}
              name="passwordConfirm"
              autoComplete="new-password"
              placeholder="비밀번호를 한번 더 입력해 주세요"
              value={form.passwordConfirm}
              onChange={handleChange}
              className={styles.input}
            />
            <button
              type="button"
              onClick={() => {
                setPasswordVisible((v) => !v);
              }}
              className={styles.visibilityToggle}
              aria-label="비밀번호 표시"
            >
              {passwordVisible ? <Eye size={24} /> : <EyeOff size={24} />}
            </button>
          </div>
          {passwordConfirmError !== null && (
            <p className={styles.fieldError}>{passwordConfirmError}</p>
          )}
        </div>

        <AgreeBox
          agreements={agreements}
          allAgreed={allAgreed}
          onToggle={toggleAgreement}
          onToggleAll={toggleAll}
        />
        {errorMessage !== null && (
          <p className={styles.fieldError}>{errorMessage}</p>
        )}
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={!canSubmit || isPending}
        >
          회원가입
        </button>
      </form>
    </section>
  );
}
