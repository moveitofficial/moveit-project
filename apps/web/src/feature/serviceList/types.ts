import type { ServiceListSort } from './constants';
import type {
  Pagination,
  Region,
  ServiceCategoryName,
  ServiceGroupName,
  ServiceListItem,
  TechStackName,
} from '@/mocks/types';
import type { Route } from 'next';

export type ServiceListCategoryFilter = 'ALL' | ServiceCategoryName;

export interface ServiceListCategoryOption {
  id: ServiceListCategoryFilter;
  label: string;
}

export interface ServiceListHeroCopy {
  eyebrow: string;
  title: string;
  descriptionPrefix: string;
}

export interface ServiceListFeaturedCopy {
  title: string;
  description: string;
}

export interface ServiceListConfig {
  serviceGroup: ServiceGroupName;
  basePath: Route;
  hero: ServiceListHeroCopy;
  featured: ServiceListFeaturedCopy;
  categoryOptions: ServiceListCategoryOption[];
  heroDescriptionVariant?: 'regular' | 'bold';
}

export interface ServiceListSearchParams {
  category: ServiceListCategoryFilter;
  page: number;
  sort: ServiceListSort;
  keyword: string;
  techStacks: TechStackName[];
  regions: Region[];
  price: string | null;
}

export interface ServiceListServiceItem extends ServiceListItem {
  techStacks: TechStackName[];
  region: Region | null;
}

export interface ServiceListFilterCounts {
  totalCount: number;
  categoryCounts: Record<'ALL' | ServiceCategoryName, number>;
  priceCounts: Record<string, number>;
  techStackCounts: Record<TechStackName, number>;
  regionCounts: Record<Region, number>;
}

export interface GetServiceListPageDataParams
  extends ServiceListSearchParams {
  pageSize: number;
}

export interface ServiceListPageData {
  featured: ServiceListServiceItem[];
  filterCounts: ServiceListFilterCounts;
  items: ServiceListServiceItem[];
  pagination: Pagination;
}
