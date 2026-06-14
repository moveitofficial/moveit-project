'use client';

import { ApiError } from '@repo/fetcher';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { signIn, type SignInData, type SignInResponse } from './api';

import { useAdminStore } from '@/stores/admin-store';

export function useAdminSignIn() {
  const router = useRouter();

  return useMutation<SignInResponse, Error, SignInData>({
    mutationFn: signIn,
    onSuccess: ({ data }) => {
      useAdminStore.getState().setAdmin(data.admin);
      router.replace(
        data.admin.mustChangePassword ? '/password/reset' : '/dashboard',
      );
      router.refresh();
    },
  });
}

export function toSignInErrorMessage(error: Error | null): string | null {
  if (error === null) return null;
  if (error instanceof ApiError && error.status < 500) {
    return error.message;
  }
  return '로그인에 실패했습니다. 잠시 후 다시 시도해주세요.';
}
