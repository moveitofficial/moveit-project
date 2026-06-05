export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

export interface Pagination {
  page: number;
  pageSize: number;
  totalCount: number;
  hasNext: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: Pagination;
}

export interface InfiniteScrollPage<T> {
  items: T[];
  hasNext: boolean;
}
