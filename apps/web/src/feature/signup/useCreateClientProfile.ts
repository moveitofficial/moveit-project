'use client';

import { ApiError } from '@repo/fetcher';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { createClientProfile, type ClientProfileRequest } from './api';

import type { ApiSuccess } from '@/types/api';

export function useCreateClientProfile() {
  const router = useRouter();

  return useMutation<ApiSuccess<unknown>, Error, ClientProfileRequest>({
    mutationFn: createClientProfile,
    onSuccess: () => {
      router.replace('/'); // 온보딩 완료 → 홈
      router.refresh();
    },
  });
}

export function toClientProfileErrorMessage(
  error: Error | null,
): string | null {
  if (error === null) return null;
  if (error instanceof ApiError && error.status < 500) {
    return error.message;
  }
  return '저장에 실패했습니다. 잠시 후 다시 시도해주세요.';
}
