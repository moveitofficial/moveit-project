'use client';

import { typography } from '@repo/styles/typography';
import { ConfirmModal, Modal } from '@repo/ui/Modal';
import { useId, useState, type ChangeEvent, type FormEvent } from 'react';

import * as styles from './AdminRegisterButton.css';

/**
 * 실제 등록은 아직 미구현
 */
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

export default function AdminRegisterButton() {
  const formTitleId = useId();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const [form, setForm] = useState({ ...INITIAL_FORM });
  const [submittedName, setSubmittedName] = useState('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setForm({ ...INITIAL_FORM });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isRegisterFormValid(form)) {
      return;
    }

    setSubmittedName(form.name.trim());
    setIsFormOpen(false);
    setIsSuccessOpen(true);
    setForm({ ...INITIAL_FORM });
  };

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
            <div className={styles.fields}>
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

            <div className={styles.formActions}>
              <button
                type="submit"
                className={`${typography.f16EB} ${styles.submitButton}`}
                disabled={!isRegisterFormValid(form)}
              >
                관리자 등록
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
