import { COMMUNITY_FILTERS, type CommunityFilter } from './constants';

export function param(raw: string | string[] | undefined): string | undefined {
  const v = typeof raw === 'string' ? raw : undefined;
  return v === '' ? undefined : v;
}

export function parseCommunityCategory(
  raw: string | string[] | undefined,
): CommunityFilter['id'] {
  const value = param(raw);
  if (value === undefined) {
    return 'ALL';
  }

  const isValid = COMMUNITY_FILTERS.some((filter) => filter.id === value);
  return isValid ? (value as CommunityFilter['id']) : 'ALL';
}

export function parsePage(raw: string | string[] | undefined): number {
  return Math.max(1, Number.parseInt(param(raw) ?? '', 10) || 1);
}
