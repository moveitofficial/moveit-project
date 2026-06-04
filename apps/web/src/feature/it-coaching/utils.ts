import {
  IT_COACHING_CATEGORY_OPTIONS,
  IT_COACHING_PRICE_FILTERS,
  IT_COACHING_REGION_FILTERS,
  IT_COACHING_SORT_OPTIONS,
  IT_COACHING_TECH_STACK_FILTERS,
  type ItCoachingCategoryFilter,
  type ItCoachingSort,
} from './constants';

import type { Region, TechStackName } from '@/mocks/types';
import type { Route } from 'next';


export function param(raw: string | string[] | undefined): string | undefined {
  const v = typeof raw === 'string' ? raw : undefined;
  return v === '' ? undefined : v;
}

export function parsePage(raw: string | string[] | undefined): number {
  return Math.max(1, Number.parseInt(param(raw) ?? '', 10) || 1);
}

export function parseCategory(
  raw: string | string[] | undefined,
): ItCoachingCategoryFilter {
  const value = param(raw);
  if (value === undefined) {
    return 'ALL';
  }

  const isValid = IT_COACHING_CATEGORY_OPTIONS.some(
    (option) => option.id === value,
  );
  return isValid ? (value as ItCoachingCategoryFilter) : 'ALL';
}

export function parseSort(raw: string | string[] | undefined): ItCoachingSort {
  const value = param(raw);
  if (value === undefined) {
    return 'RECOMMENDED';
  }

  const isValid = IT_COACHING_SORT_OPTIONS.some((option) => option.id === value);
  return isValid ? (value as ItCoachingSort) : 'RECOMMENDED';
}

export function parseKeyword(raw: string | string[] | undefined): string {
  return param(raw)?.trim() ?? '';
}

export function parseCsv(raw: string | string[] | undefined): string[] {
  const value = param(raw);
  if (value === undefined) {
    return [];
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

export function parseTechStacks(
  raw: string | string[] | undefined,
): TechStackName[] {
  const values = parseCsv(raw);
  const validNames = new Set(
    IT_COACHING_TECH_STACK_FILTERS.map((item) => item.id),
  );

  return values.filter((value): value is TechStackName =>
    validNames.has(value as TechStackName),
  );
}

export function parseRegions(raw: string | string[] | undefined): Region[] {
  const values = parseCsv(raw);
  const validNames = new Set(IT_COACHING_REGION_FILTERS.map((item) => item.id));

  return values.filter((value): value is Region =>
    validNames.has(value as Region),
  );
}

export function parsePriceFilter(
  raw: string | string[] | undefined,
): string | null {
  const value = param(raw);
  if (value === undefined) {
    return null;
  }

  const isValid = IT_COACHING_PRICE_FILTERS.some((item) => item.id === value);
  return isValid ? value : null;
}

export interface ItCoachingSearchParams {
  category: ItCoachingCategoryFilter;
  page: number;
  sort: ItCoachingSort;
  keyword: string;
  techStacks: TechStackName[];
  regions: Region[];
  price: string | null;
}

export function parseItCoachingSearchParams(
  raw: Record<string, string | string[] | undefined>,
): ItCoachingSearchParams {
  return {
    category: parseCategory(raw.category),
    page: parsePage(raw.page),
    sort: parseSort(raw.sort),
    keyword: parseKeyword(raw.q),
    techStacks: parseTechStacks(raw.techStacks),
    regions: parseRegions(raw.regions),
    price: parsePriceFilter(raw.price),
  };
}

export function buildItCoachingHref(
  params: ItCoachingSearchParams,
  updates: Partial<ItCoachingSearchParams> = {},
): Route {
  const merged: ItCoachingSearchParams = {
    ...params,
    ...updates,
  };

  const search = new URLSearchParams();

  if (merged.category !== 'ALL') {
    search.set('category', merged.category);
  }
  if (merged.sort !== 'RECOMMENDED') {
    search.set('sort', merged.sort);
  }
  if (merged.keyword.length > 0) {
    search.set('q', merged.keyword);
  }
  if (merged.techStacks.length > 0) {
    search.set('techStacks', merged.techStacks.join(','));
  }
  if (merged.regions.length > 0) {
    search.set('regions', merged.regions.join(','));
  }
  if (merged.price !== null) {
    search.set('price', merged.price);
  }
  if (merged.page > 1) {
    search.set('page', String(merged.page));
  }

  const query = search.toString();
  return (query.length > 0 ? `/it-coaching?${query}` : '/it-coaching');
}
