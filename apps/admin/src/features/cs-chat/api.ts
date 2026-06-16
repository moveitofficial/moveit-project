import { api, ApiError } from '@repo/fetcher';

import type { CsAdminRoom, CsMessage } from './types';
import type { ApiSuccess, PaginatedResult } from '@/types/api';

const BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
).replace(/\/$/, '');

/** 상담방 목록 (검색·페이지네이션) */
export function getCsRooms(params: {
  search?: string;
  page: number;
}): Promise<ApiSuccess<PaginatedResult<CsAdminRoom>>> {
  const query = new URLSearchParams({ page: String(params.page) });
  if (params.search) {
    query.set('search', params.search);
  }
  return api.get<ApiSuccess<PaginatedResult<CsAdminRoom>>>(
    `/admin/cs/rooms?${query.toString()}`,
  );
}

export interface CsMessagePage {
  items: CsMessage[];
  nextCursor: string | null;
}

/** 상담방 메시지 내역 (커서 페이지네이션) */
export function getCsMessages(
  roomId: string,
  cursor?: string,
): Promise<ApiSuccess<CsMessagePage>> {
  const query = cursor ? `?cursor=${cursor}` : '';
  return api.get<ApiSuccess<CsMessagePage>>(
    `/admin/cs/rooms/${roomId}/messages${query}`,
  );
}

/** 상담 중 파일 업로드 (multipart) */
export async function uploadCsFile(
  roomId: string,
  file: File,
): Promise<CsMessage> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${BASE_URL}/admin/cs/rooms/${roomId}/upload`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => ({}))) as {
      message?: string;
    };
    throw new ApiError(
      response.status,
      error.message ?? '파일 업로드 중 오류가 발생했습니다.',
    );
  }

  const json = (await response.json()) as ApiSuccess<CsMessage>;
  return json.data;
}
