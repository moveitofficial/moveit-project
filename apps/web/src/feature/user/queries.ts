import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getMyUser, patchMyUser } from './api';

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
    mutationFn: patchMyUser,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: myUserQueryKey,
      });
    },
  });
}
