'use client';

import { skipToken, useQuery } from '@tanstack/react-query';

import { getCsMessages, getCsRooms } from './api';

import type { CsAdminRoom } from './types';
import type { ApiSuccess, PaginatedResult } from '@/types/api';

export const CS_ROOMS_KEY = ['adminCsRooms'];

type CsRoomsResponse = ApiSuccess<PaginatedResult<CsAdminRoom>>;

/**
 * 상담방 목록. 서버에서 받은 initialData로 첫 렌더 깜박임을 막고,
 * 이후 10초마다(탭 포커스 중) 갱신한다.
 */
export function useCsRooms(search: string, initialData?: CsRoomsResponse) {
  return useQuery({
    queryKey: [...CS_ROOMS_KEY, search],
    queryFn: () => getCsRooms({ search: search || undefined, page: 1 }),
    select: (response) => response.data,
    initialData: search ? undefined : initialData,
    refetchOnMount: 'always',
    refetchInterval: 10_000,
  });
}

/** 상담방 메시지 내역 */
export function useCsMessages(roomId: string | null) {
  return useQuery({
    queryKey: ['adminCsMessages', roomId],
    queryFn: roomId ? () => getCsMessages(roomId) : skipToken,
    select: (response) => response.data,
    refetchOnMount: 'always',
  });
}
