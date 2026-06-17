import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  getMyUser,
  patchClientProfile,
  patchExpertProfile,
  patchMyUser,
  patchPassword,
  patchProfileImage,
  type ChangePasswordBody,
  type PatchClientProfileBody,
  type PatchExpertProfileBody,
  type PatchMyUserBody,
} from './api';

export const myUserQueryKey = ['users', 'me'] as const;

export function useMyUserQuery() {
  return useQuery({
    queryKey: myUserQueryKey,
    queryFn: async () => {
      const res = await getMyUser();
      return res.data;
    },
  });
}

export function usePatchMyUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: PatchMyUserBody) => patchMyUser(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: myUserQueryKey });
    },
  });
}

export function usePatchClientProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: PatchClientProfileBody) => patchClientProfile(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: myUserQueryKey });
    },
  });
}

export function usePatchExpertProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: PatchExpertProfileBody) => patchExpertProfile(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: myUserQueryKey });
    },
  });
}

export function usePatchProfileImageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => patchProfileImage(file),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: myUserQueryKey });
    },
  });
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (body: ChangePasswordBody) => patchPassword(body),
  });
}
