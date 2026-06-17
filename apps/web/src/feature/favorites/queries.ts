import { useQuery } from '@tanstack/react-query';

import { getFavoriteExperts, getFavoriteServices } from './api';

export const FAVORITES_KEY = ['favorites'] as const;

export function useFavoriteServicesQuery() {
  return useQuery({
    queryKey: [...FAVORITES_KEY, 'services'],
    queryFn: async () => {
      const response = await getFavoriteServices();
      return response.data.items;
    },
  });
}

export function useFavoriteExpertsQuery() {
  return useQuery({
    queryKey: [...FAVORITES_KEY, 'experts'],
    queryFn: async () => {
      const response = await getFavoriteExperts();
      return response.data.items;
    },
  });
}
