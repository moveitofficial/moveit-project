import { param } from './queryParams';

export function parsePage(raw: string | string[] | undefined): number {
  return Math.max(1, Number.parseInt(param(raw) ?? '', 10) || 1);
}

export function parsePageSize(
  raw: string | string[] | undefined,
  defaultSize = 50,
): number {
  const v = param(raw);
  return v === undefined
    ? defaultSize
    : Math.max(1, Number.parseInt(v, 10) || defaultSize);
}

export function calcTotalPages(totalCount: number, pageSize: number): number {
  return totalCount <= 0 ? 1 : Math.ceil(totalCount / pageSize);
}
