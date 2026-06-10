import { api } from '@repo/fetcher';

import type { FaqItem } from './types';
import type { ApiSuccess, PaginatedResult } from '@/types/api';

export function getFaqs(
  page: number,
): Promise<ApiSuccess<PaginatedResult<FaqItem>>> {
  return api.get<ApiSuccess<PaginatedResult<FaqItem>>>(
    `/admin/faqs?page=${page}`,
  );
}

export function deleteFaqs(ids: string[]): Promise<ApiSuccess<void>> {
  return api.delete<ApiSuccess<void>>('/admin/faqs', { ids });
}

// 등록, 수정은 에디터 페이지 구현 후 작성
