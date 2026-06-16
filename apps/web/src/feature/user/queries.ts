import { useMutation, useQuery } from '@tanstack/react-query';

import {
  getMyUser,
  patchPassword,
  type ChangePasswordBody,
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

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (body: ChangePasswordBody) => patchPassword(body),
  });
}
