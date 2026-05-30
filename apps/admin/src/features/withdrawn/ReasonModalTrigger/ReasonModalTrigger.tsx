'use client';

import { ConfirmModal } from '@repo/ui/Modal';
import { useState } from 'react';

import * as styles from './ReasonModalTrigger.css';

interface Props {
  reason: string;
}

export default function ReasonModalTrigger({ reason }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={styles.reasonButton}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        {reason}
      </button>
      <ConfirmModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        title="탈퇴 사유"
        description={<span className={styles.modalReason}>{reason}</span>}
        actions={[
          {
            label: '확인',
            variant: 'blue',
            onClick: () => {
              setIsOpen(false);
            },
          },
        ]}
      />
    </>
  );
}
