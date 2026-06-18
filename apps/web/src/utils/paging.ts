export function calcTotalPages(totalCount: number, pageSize: number): number {
  return totalCount <= 0 ? 1 : Math.ceil(totalCount / pageSize);
}
