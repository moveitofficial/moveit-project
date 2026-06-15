'use client';

import { ApiError } from '@repo/fetcher';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { signUp, type SignUpRequest } from './api';

import { signIn, type SignInResponse } from '@/feature/login/api';
import { useUserStore } from '@/stores/user-store';

export function useEmailSignUp() {
  const router = useRouter();

  return useMutation<SignInResponse, Error, SignUpRequest>({
    mutationFn: async (body) => {
      await signUp(body);
      return signIn({ email: body.email, password: body.password }); // 가입 직후 자동 로그인
    },
    onSuccess: ({ data }, body) => {
      useUserStore.getState().setUser(data.user);
      router.replace(
        body.role === 'EXPERT'
          ? '/signup/expert/activity-info'
          : '/signup/client/info',
      );
      router.refresh();
    },
  });
}
export function toSignUpErrorMessage(error: Error | null): string | null {
  if (error === null) return null;
  if (error instanceof ApiError && error.status < 500) {
    return error.message;
  }
  return '회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.';
}
