import type { ItCoachingSearchParams } from './utils';
import type {
  Pagination,
  Region,
  ServiceCategoryName,
  ServiceListItem,
  TechStackName,
} from '@/mocks/types';

export interface ItCoachingServiceItem extends ServiceListItem {
  techStacks: TechStackName[];
  region: Region | null;
}

export interface ItCoachingFilterCounts {
  totalCount: number;
  categoryCounts: Record<'ALL' | ServiceCategoryName, number>;
  priceCounts: Record<string, number>;
  techStackCounts: Record<TechStackName, number>;
  regionCounts: Record<Region, number>;
}

export interface GetItCoachingPageDataParams extends ItCoachingSearchParams {
  pageSize: number;
}

export interface ItCoachingPageData {
  featured: ItCoachingServiceItem[];
  filterCounts: ItCoachingFilterCounts;
  items: ItCoachingServiceItem[];
  pagination: Pagination;
}
