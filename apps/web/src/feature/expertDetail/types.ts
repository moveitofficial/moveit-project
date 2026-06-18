import type { PortfolioModalExpertContext } from '@/feature/portfolioDetail/types';
import type {
  ExpertDetail,
  PortfolioListItem,
  ServiceListItem,
} from '@/mocks/types';

export type ExpertDetailViewerRole = 'guest' | 'client' | 'owner' | 'expert-other';

export interface ExpertDetailDisplayStats {
  totalOrderCount: number;
  serviceCount: number;
  averageRating: number;
  reviewCount: number;
  purchaseRate: number;
  completionRate: number;
  isNewExpert: boolean;
}

export interface ExpertDetailBusinessInfo {
  clientNames: string[];
  foundedYearLabel: string | null;
  regionLabel: string | null;
  employeeRangeLabel: string | null;
  contactTimeLabel: string;
}

export interface ExpertDetailPageData {
  expert: ExpertDetail;
  displayStats: ExpertDetailDisplayStats;
  businessInfo: ExpertDetailBusinessInfo;
  portfolios: PortfolioListItem[];
  services: ServiceListItem[];
  favoriteCount: number;
  portfolioExpertContext: PortfolioModalExpertContext;
}

export interface ExpertDetailPageResult {
  data: ExpertDetailPageData;
  viewer: ExpertDetailViewerRole;
}

export type ExpertReportReason =
  | 'FALSE_INFORMATION'
  | 'ABUSE'
  | 'ILLEGAL_ACTIVITY'
  | 'EXTERNAL_CONTACT'
  | 'SPAM'
  | 'OTHER';

export interface ExpertInquiryServiceOption {
  id: string;
  title: string;
}
