'use client';

import { ApiError } from '@repo/fetcher';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { createExpertProfile, type ExpertProfileRequest } from './api';
import { useExpertSignupStore } from './expertSignupStore';

import type { ApiSuccess } from '@/types/api';

export function useCreateExpertProfile() {
  const router = useRouter();
  const clear = useExpertSignupStore((s) => s.clear);

  return useMutation<ApiSuccess<unknown>, Error, ExpertProfileRequest>({
    mutationFn: createExpertProfile,
    onSuccess: () => {
      clear();
      router.push('/signup/expert/portfolio');
    },
  });
}

export function toExpertProfileErrorMessage(
  error: Error | null,
): string | null {
  if (error === null) return null;
  if (error instanceof ApiError && error.status < 500) {
    return error.message;
  }
  return '저장에 실패했습니다. 잠시 후 다시 시도해주세요.';
}
