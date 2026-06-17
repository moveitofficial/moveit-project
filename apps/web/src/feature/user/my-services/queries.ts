'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { deleteService, getMyServices, updateServiceStatus } from './api';

export const MY_SERVICES_KEY = ['myServices'];

export function useMyServicesQuery() {
  return useQuery({
    queryKey: MY_SERVICES_KEY,
    queryFn: async () => {
      const response = await getMyServices();
      return response.data;
    },
  });
}

export function useUpdateServiceStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      serviceId,
      status,
    }: {
      serviceId: string;
      status: 'ACTIVE' | 'PAUSED';
    }) => updateServiceStatus(serviceId, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: MY_SERVICES_KEY });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (serviceId: string) => deleteService(serviceId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: MY_SERVICES_KEY });
    },
  });
}
