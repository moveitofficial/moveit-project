'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { clearAdminProfileCookie } from './adminProfileCookie';
import { signOut } from './api';

import { useAdminStore } from '@/stores/admin-store';

export function useAdminSignOut() {
  const router = useRouter();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      useAdminStore.getState().setAdmin(null);
      clearAdminProfileCookie();
      router.replace('/login');
      router.refresh();
    },
  });
}
