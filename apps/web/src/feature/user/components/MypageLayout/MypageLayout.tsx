'use client';

import { ApiError } from '@repo/fetcher';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { MypageMenu } from '../MypageMenu';

import * as styles from './MypageLayout.css';

import type { ReactNode } from 'react';

import { useMyUserQuery } from '@/feature/user/queries';

interface Props {
  children: ReactNode;
}

export default function MypageLayout({ children }: Props) {
  const router = useRouter();
  const { data: user, isPending, isError, error } = useMyUserQuery();

  useEffect(() => {
    if (error instanceof ApiError && error.status === 401) {
      router.push('/login');
    }
  }, [error, router]);

  if (isPending) {
    return (
      <div className={styles.page}>
        <p className={styles.statusMessage}>마이페이지를 불러오는 중입니다.</p>
      </div>
    );
  }

  if (isError) {
    const message =
      error instanceof ApiError
        ? error.message
        : '마이페이지를 불러오지 못했습니다.';
    return (
      <div className={styles.page}>
        <p className={styles.errorMessage}>{message}</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <MypageMenu role={user.role} />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
