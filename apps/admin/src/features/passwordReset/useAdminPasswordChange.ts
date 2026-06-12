'use client';

import { ApiError } from '@repo/fetcher';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { signOut } from '../login/api';

import { updatePassword, type UpdatePasswordData } from './api';

import type { ApiSuccess } from '@/types/api';

export function useAdminPasswordChange() {
  const router = useRouter();

  return useMutation<ApiSuccess<null>, Error, UpdatePasswordData>({
    mutationFn: updatePassword,
    onSuccess: async () => {
      await signOut();
      router.replace('/login');
      router.refresh();
    },
  });
}

export function toUpdatePasswordErrorMessage(
  error: Error | null,
): string | null {
  if (error === null) return null;
  if (error instanceof ApiError && error.status === 400) {
    return '현재 비밀번호를 틀리셨습니다.';
  }
  if (error instanceof ApiError && error.status < 500) {
    return error.message;
  }
  return '비밀번호 변경에 실패했습니다. 잠시 후 다시 시도해주세요.';
}
