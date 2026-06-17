import { api } from '@repo/fetcher';

import type { CsMessage, CsRoom } from './types';
import type { ApiSuccess, PaginatedResult } from '@/mocks/types';

/** CS 상담방 생성 (첫 문의 내용 포함) */
export async function createCsRoom(content: string): Promise<CsRoom> {
  const response = await api.post<ApiSuccess<CsRoom>>('/cs/rooms', { content });
  return response.data;
}

/** 내 CS 상담방 목록 (페이지네이션) */
export async function getCsRooms(page = 1): Promise<PaginatedResult<CsRoom>> {
  const response = await api.get<ApiSuccess<PaginatedResult<CsRoom>>>(
    `/cs/rooms?page=${page}`,
  );
  return response.data;
}

export interface CsMessagePage {
  items: CsMessage[];
  nextCursor: string | null;
}

/** 상담방 메시지 내역 (커서 페이지네이션) */
export async function getCsMessages(
  roomId: string,
  cursor?: string,
): Promise<CsMessagePage> {
  const query = cursor ? `?cursor=${cursor}` : '';
  const response = await api.get<ApiSuccess<CsMessagePage>>(
    `/cs/rooms/${roomId}/messages${query}`,
  );
  return response.data;
}
