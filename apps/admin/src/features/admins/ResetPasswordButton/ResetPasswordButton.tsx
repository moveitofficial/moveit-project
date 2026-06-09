'use client';

import { typography } from '@repo/styles/typography';
import { ConfirmModal } from '@repo/ui/Modal';
import { useState } from 'react';

import * as styles from './ResetPasswordButton.css';

import { resetAdminPassword } from '@/features/admins/api';

interface Props {
  adminId: string;
  adminName: string;
  isSuper: boolean;
}

export default function ResetPasswordButton({
  adminId,
  adminName,
  isSuper,
}: Props) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  if (!isSuper) {
    return null;
  }

  const handleConfirm = async () => {
    await resetAdminPassword(adminId);
    setIsConfirmOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className={`${typography.f14B} ${styles.button}`}
        onClick={() => {
          setIsConfirmOpen(true);
        }}
      >
        비밀번호 초기화
      </button>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
        }}
        title="비밀번호 초기화"
        description={`${adminName} 관리자의 비밀번호를 초기화하시겠습니까?`}
        actions={[
          {
            label: '초기화',
            variant: 'red',
            onClick: () => {
              void handleConfirm();
            },
          },
          {
            label: '취소',
            variant: 'white',
            onClick: () => {
              setIsConfirmOpen(false);
            },
          },
        ]}
      />
    </>
  );
}
