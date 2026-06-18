'use client';

import { ApiError } from '@repo/fetcher';
import { typography } from '@repo/styles/typography';
import { ConfirmModal, Modal } from '@repo/ui/Modal';
import { useRouter } from 'next/navigation';
import { useId, useState, type ChangeEvent, type FormEvent } from 'react';

import * as styles from './AdminRegisterButton.css';

import { createAdmin } from '@/features/admins/api';

interface Props {
  isSuper: boolean;
}

const INITIAL_FORM = { email: '', name: '', password: '', passwordConfirm: '' };

function isRegisterFormValid(form: typeof INITIAL_FORM): boolean {
  const { email, name, password, passwordConfirm } = form;

  return (
    email.trim() !== '' &&
    name.trim() !== '' &&
    password !== '' &&
    password === passwordConfirm
  );
}

export default function AdminRegisterButton({ isSuper }: Props) {
  const router = useRouter();
  const formTitleId = useId();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const [form, setForm] = useState({ ...INITIAL_FORM });
  const [submittedName, setSubmittedName] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setErrorMessage(null);
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setForm({ ...INITIAL_FORM });
    setErrorMessage(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isRegisterFormValid(form)) {
      return;
    }

    setIsSubmitting(true);
    void createAdmin(form)
      .then(() => {
        setSubmittedName(form.name.trim());
        setIsFormOpen(false);
        setIsSuccessOpen(true);
        setForm({ ...INITIAL_FORM });
        setErrorMessage(null);
        router.refresh();
      })
      .catch((error: unknown) => {
        if (error instanceof ApiError && error.status === 409) {
          setErrorMessage('이미 등록된 이메일입니다.');
        } else {
          setErrorMessage('관리자 등록에 실패했습니다. 다시 시도해주세요.');
        }
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  if (!isSuper) return null;

  return (
    <>
      <button
        type="button"
        className={`${typography.f16EB} ${styles.registerButton}`}
        onClick={() => {
          setIsFormOpen(true);
        }}
      >
        관리자 등록
      </button>

      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        labelledBy={formTitleId}
      >
        <div className={styles.formContent}>
          <h2
            id={formTitleId}
            className={`${typography.f18EB} ${styles.formTitle}`}
          >
            관리자 등록
          </h2>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div
              className={
                errorMessage === null ? styles.fields : styles.fieldsCompact
              }
            >
              <div className={styles.fieldGroup}>
                <label htmlFor="admin-email" className={typography.f14EB}>
                  이메일
                </label>
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  className={`${typography.f14R} ${styles.fieldInput}`}
                  placeholder="이메일을 입력해주세요"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="admin-name" className={typography.f14EB}>
                  이름
                </label>
                <input
                  id="admin-name"
                  name="name"
                  type="text"
                  className={`${typography.f14R} ${styles.fieldInput}`}
                  placeholder="이름을 입력해주세요"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                />
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="admin-password" className={typography.f14EB}>
                  비밀번호
                </label>
                <input
                  id="admin-password"
                  name="password"
                  type="password"
                  className={`${typography.f14R} ${styles.fieldInput}`}
                  placeholder="비밀번호를 입력해주세요"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </div>

              <div className={styles.fieldGroup}>
                <label
                  htmlFor="admin-password-confirm"
                  className={typography.f14EB}
                >
                  비밀번호 확인
                </label>
                <input
                  id="admin-password-confirm"
                  name="passwordConfirm"
                  type="password"
                  className={`${typography.f14R} ${styles.fieldInput}`}
                  placeholder="한번 더 비밀번호를 입력해주세요"
                  value={form.passwordConfirm}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </div>
            </div>

            {errorMessage !== null && (
              <p className={`${typography.f14R} ${styles.errorMessage}`}>
                {errorMessage}
              </p>
            )}

            <div className={styles.formActions}>
              <button
                type="submit"
                className={`${typography.f16EB} ${styles.submitButton}`}
                disabled={!isRegisterFormValid(form) || isSubmitting}
              >
                {isSubmitting ? '등록 중...' : '관리자 등록'}
              </button>
              <button
                type="button"
                className={`${typography.f16EB} ${styles.cancelButton}`}
                onClick={handleCloseForm}
              >
                취소
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={isSuccessOpen}
        onClose={() => {
          setIsSuccessOpen(false);
        }}
        title="관리자 등록완료"
        description={`${submittedName} 관리자가 등록 완료되었습니다.\n최초 로그인 후 비밀번호를 변경해주세요.`}
        actions={[
          {
            label: '확인',
            variant: 'blue',
            onClick: () => {
              setIsSuccessOpen(false);
            },
          },
        ]}
      />
    </>
  );
}
