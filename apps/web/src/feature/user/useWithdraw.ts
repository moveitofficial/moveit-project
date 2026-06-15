'use client';

import { ApiError } from '@repo/fetcher';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { withdrawUser, type WithdrawData } from './api';

import type { ApiSuccess } from '@/types/api';

import { useUserStore } from '@/stores/user-store';

export function useWithdraw() {
  const router = useRouter();

  return useMutation<ApiSuccess<WithdrawData>, Error, string>({
    mutationFn: withdrawUser,
    onSuccess: () => {
      useUserStore.getState().setUser(null);
      router.replace('/login');
      router.refresh();
    },
  });
}

export function toWithdrawErrorMessage(error: Error | null): string | null {
  if (error === null) return null;
  if (error instanceof ApiError && error.status < 500) {
    return error.message;
  }
  return '회원 탈퇴에 실패했습니다. 잠시 후 다시 시도해주세요.';
}
