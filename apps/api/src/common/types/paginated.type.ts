// 페이지네이션 응답 공통 타입 (toPaginatedResponse 유틸 반환 형태)
export interface Paginated<T> {
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    hasNext: boolean;
  };
}
