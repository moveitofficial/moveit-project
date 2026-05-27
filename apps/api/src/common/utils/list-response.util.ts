export const toListResponse = <T>(items: T[]) => ({
  count: items.length,
  items,
});

export const toPaginatedResponse = <T>(
  items: T[],
  pagination: { page: number; pageSize: number; totalCount: number },
) => ({
  items,
  pagination: {
    ...pagination,
    hasNext: pagination.page * pagination.pageSize < pagination.totalCount,
  },
});
