import type { ApiSuccess, InfiniteScrollPage, PaginatedResult } from '@/types/api';

export function toScrollPage<T>(
  response: ApiSuccess<PaginatedResult<T>>,
): InfiniteScrollPage<T> {
  return {
    items: response.data.items,
    hasNext: response.data.pagination.hasNext,
  };
}
