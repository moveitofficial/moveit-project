'use client';

import { ApiError } from '@repo/fetcher';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { ClientMyInfoView } from '../ClientMyInfoView';
import { ExpertProfileView } from '../ExpertProfileView';

import * as styles from './MyInfoView.css';

import { useMyUserQuery } from '@/feature/user/queries';

export default function MyInfoView() {
  const router = useRouter();
  const { data, isPending, isError, error } = useMyUserQuery();

  useEffect(() => {
    if (error instanceof ApiError && error.status === 401) {
      router.push('/login');
    }
  }, [error, router]);

  if (isPending) {
    return (
      <section className={styles.root}>
        <h1 className={styles.title}>내 정보</h1>
        <p className={styles.statusMessage}>내 정보를 불러오는 중입니다.</p>
      </section>
    );
  }

  if (isError) {
    const message =
      error instanceof ApiError
        ? error.message
        : '내 정보를 불러오지 못했습니다.';
    return (
      <section className={styles.root}>
        <h1 className={styles.title}>내 정보</h1>
        <p className={styles.errorMessage}>{message}</p>
      </section>
    );
  }

  return data.role === 'EXPERT' ? (
    <ExpertProfileView user={data} />
  ) : (
    <ClientMyInfoView user={data} />
  );
}
