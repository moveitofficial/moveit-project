export const toListResponse = <T>(items: T[]) => ({
  count: items.length,
  items,
});
