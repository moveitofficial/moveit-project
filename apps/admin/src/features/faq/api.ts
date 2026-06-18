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

export interface CreateFaqBody {
  title: string;
  content: string;
}

// 등록: title + content(에디터 HTML)
export function createFaq(body: CreateFaqBody): Promise<ApiSuccess<void>> {
  return api.post<ApiSuccess<void>>('/admin/faqs', body);
}
