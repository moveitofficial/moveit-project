import {
  SERVICE_LIST_MAX_TECH_STACKS,
  SERVICE_LIST_PRICE_FILTERS,
  SERVICE_LIST_REGION_FILTERS,
  SERVICE_LIST_SORT_OPTIONS,
  SERVICE_LIST_TECH_STACK_FILTERS,
  type ServiceListSort,
} from './constants';

import type {
  ServiceListCategoryFilter,
  ServiceListConfig,
  ServiceListSearchParams,
} from './types';
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
  categoryOptions: ServiceListConfig['categoryOptions'],
): ServiceListCategoryFilter {
  const value = param(raw);
  if (value === undefined) {
    return 'ALL';
  }

  const isValid = categoryOptions.some((option) => option.id === value);
  return isValid ? (value as ServiceListCategoryFilter) : 'ALL';
}

export function parseSort(raw: string | string[] | undefined): ServiceListSort {
  const value = param(raw);
  if (value === undefined) {
    return 'RECOMMENDED';
  }

  const isValid = SERVICE_LIST_SORT_OPTIONS.some(
    (option) => option.id === value,
  );
  return isValid ? (value as ServiceListSort) : 'RECOMMENDED';
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

export function normalizeTechStacks(
  techStacks: TechStackName[],
): TechStackName[] {
  return techStacks.slice(0, SERVICE_LIST_MAX_TECH_STACKS);
}

export function parseTechStacks(
  raw: string | string[] | undefined,
): TechStackName[] {
  const values = parseCsv(raw);
  const validNames = new Set(
    SERVICE_LIST_TECH_STACK_FILTERS.map((item) => item.id),
  );

  return normalizeTechStacks(
    values.filter((value): value is TechStackName =>
      validNames.has(value as TechStackName),
    ),
  );
}

export function parseRegions(raw: string | string[] | undefined): Region[] {
  const values = parseCsv(raw);
  const validNames = new Set(
    SERVICE_LIST_REGION_FILTERS.map((item) => item.id),
  );

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

  const isValid = SERVICE_LIST_PRICE_FILTERS.some((item) => item.id === value);
  return isValid ? value : null;
}

export function parseServiceListSearchParams(
  raw: Record<string, string | string[] | undefined>,
  config: ServiceListConfig,
): ServiceListSearchParams {
  return {
    category: parseCategory(raw.category, config.categoryOptions),
    page: parsePage(raw.page),
    sort: parseSort(raw.sort),
    keyword: parseKeyword(raw.q),
    techStacks: parseTechStacks(raw.techStacks),
    regions: parseRegions(raw.regions),
    price: parsePriceFilter(raw.price),
  };
}

export const SERVICE_LIST_DEFAULT_PARAMS: ServiceListSearchParams = {
  category: 'ALL',
  page: 1,
  sort: 'RECOMMENDED',
  keyword: '',
  techStacks: [],
  regions: [],
  price: null,
};

export function buildServiceListHref(
  config: ServiceListConfig,
  params: ServiceListSearchParams,
  updates: Partial<ServiceListSearchParams> = {},
): Route {
  const merged: ServiceListSearchParams = {
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
  const basePath = config.basePath;
  return query.length > 0 ? `${basePath}?${query}` : basePath;
}
