import type { SERVICE_DETAIL_REVIEW_SORT_OPTIONS, SERVICE_DETAIL_TABS } from './constants';
import type {
  ExpertStats,
  PortfolioListItem,
  Review,
  ServiceDetail,
  TechStackName,
} from '@/mocks/types';

export type ServiceDetailTabId = (typeof SERVICE_DETAIL_TABS)[number]['id'];

export type ServiceDetailReviewSort =
  (typeof SERVICE_DETAIL_REVIEW_SORT_OPTIONS)[number]['id'];

export type ServiceDetailViewerRole = 'guest' | 'client' | 'owner';

export interface ServiceDetailPageData {
  service: ServiceDetail;
  expertStats: ExpertStats;
  orderCount: number;
  favoriteCount: number;
  portfolios: PortfolioListItem[];
  portfoliosHasMore: boolean;
  contactTime: {
    start: string;
    end: string;
  };
  reviewsHasMore: boolean;
  relatedServiceTechStacks: Record<string, TechStackName[]>;
}

export interface ServiceDetailReviewResult {
  items: Review[];
  totalCount: number;
  averageRating: number;
  hasMore: boolean;
}
