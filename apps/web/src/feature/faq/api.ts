import { publicApi } from '@repo/fetcher';

import type { ApiSuccess, PaginatedResult } from '@/mocks/types';

export interface FaqApiItem {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

// FAQ는 공개 데이터. 한 화면에 모두 보여주므로 넉넉히 가져온다.
const FAQ_PAGE_SIZE = 100;

export function getFaqs(): Promise<ApiSuccess<PaginatedResult<FaqApiItem>>> {
  return publicApi.get<ApiSuccess<PaginatedResult<FaqApiItem>>>(
    `/faqs?page=1&pageSize=${String(FAQ_PAGE_SIZE)}`,
  );
}
