'use client';

import { typography } from '@repo/styles/typography';
import { ConfirmModal } from '@repo/ui/Modal';
import { formatDate } from '@repo/utils';
import { useState, useTransition } from 'react';

import * as styles from './BlacklistButton.css';

import { blockUser, unblockUser } from '@/features/users/actions';

interface Props {
  userId: string;
  userName: string | null;
  isBlocked: boolean;
  blockedAt: string | null;
  blockedByAdminName: string | null;
}

export default function BlacklistButton({
  userId,
  userName,
  isBlocked,
  blockedAt,
  blockedByAdminName,
}: Props) {
  const displayName = userName ?? '해당';
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      try {
        await (isBlocked ? unblockUser(userId) : blockUser(userId));
        setIsOpen(false);
      } catch {
        alert('블랙리스트 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    });
  }

  return (
    <>
      <div className={styles.wrapper}>
        <button
          type="button"
          className={`${typography.f14B} ${isBlocked ? styles.unblockButton : styles.blockButton}`}
          disabled={isPending}
          onClick={() => {
            setIsOpen(true);
          }}
        >
          {isBlocked ? '블랙리스트 해제' : '블랙리스트 추가'}
        </button>

        {isBlocked ? (
          <div className={styles.blockMeta}>
            <p className={typography.f12R}>
              관리자: {blockedByAdminName ?? '-'}
            </p>
            <p className={typography.f12R}>
              {blockedAt === null ? '-' : formatDate(blockedAt)}
            </p>
          </div>
        ) : null}
      </div>

      <ConfirmModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        title={isBlocked ? '블랙리스트 해제' : '블랙리스트 추가'}
        description={
          isBlocked
            ? `${displayName} 유저를 \n 정말 블랙리스트에서 삭제하시겠습니까?`
            : `${displayName} 유저를 \n 블랙리스트에 추가하시겠습니까?`
        }
        actions={[
          {
            label: '확인',
            variant: 'blue',
            onClick: handleConfirm,
          },
          {
            label: '아니오',
            variant: 'white',
            onClick: () => {
              setIsOpen(false);
            },
          },
        ]}
      />
    </>
  );
}
