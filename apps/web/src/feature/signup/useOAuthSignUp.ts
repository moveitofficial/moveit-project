'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { oauthSignUp, type OAuthSignUpResponse } from './api';

import type { Role } from '@/types/enums';

import { useUserStore } from '@/stores/user-store';

export function useOAuthSignUp() {
  const router = useRouter();

  return useMutation<OAuthSignUpResponse, Error, Role>({
    mutationFn: oauthSignUp,
    onSuccess: ({ data }, role) => {
      useUserStore.getState().setUser(data.user);
      router.replace(
        role === 'EXPERT'
          ? '/signup/expert/activity-info'
          : '/signup/client/info',
      );
      router.refresh();
    },
  });
}
