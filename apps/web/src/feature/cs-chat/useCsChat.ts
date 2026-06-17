'use client';

import {
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { createCsRoom, getCsMessages, getCsRooms } from './api';

export const CS_ROOMS_KEY = ['csRooms'];

/** 내 CS 상담방 목록 (열 때마다 최신화) */
export function useCsRooms() {
  return useQuery({
    queryKey: CS_ROOMS_KEY,
    queryFn: () => getCsRooms(),
    refetchOnMount: 'always',
  });
}

/** 상담방 메시지 내역 (방 입장 시마다 최신 내역으로) */
export function useCsMessages(roomId: string | null) {
  return useQuery({
    queryKey: ['csMessages', roomId],
    queryFn: roomId ? () => getCsMessages(roomId) : skipToken,
    refetchOnMount: 'always',
  });
}

export function useCreateCsRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCsRoom,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: CS_ROOMS_KEY }),
  });
}
