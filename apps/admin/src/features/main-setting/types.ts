import type { Pagination } from '@/types/api';
import type { Provider, ServiceStatus, ServiceType } from '@/types/enums';

export type MainSectionType =
  | 'POPULAR_IT_COACHING'
  | 'POPULAR_PROJECT_REQUEST'
  | 'MOVEIT_POPULAR_PROJECT_EXPERT'
  | 'MOVEIT_POPULAR_COACHING'
  | 'RECOMMENDED_IT_COACHING'
  | 'RECOMMENDED_PROJECT_REQUEST';

export interface ServiceMainItem {
  mainSettingId: string;
  serviceId: string;
  title: string;
  category: ServiceType;
  businessName: string | null;
  status: ServiceStatus;
  servicePrice: number;
  createdAt: string;
  orderCount: number;
}

export interface BannerItem {
  id: string;
  imageUrl: string; // 이미지 파일 URL
  actionUrl: string; // 링크 URL
  createdAt: string;
}

export interface ExpertMainItem {
  mainSettingId: string;
  userId: string;
  businessName: string | null;
  email: string;
  specialties: ServiceType[];
  provider: Provider;
  isApproved: boolean;
  region: string | null;
  saleCount: number;
  reportCount: number;
  createdAt: string;
}

export interface MainSettingsResponse {
  popularItCoaching: ServiceMainItem[];
  banners: BannerItem[];
  popularProjectRequest: ServiceMainItem[];
  recommendedItCoaching: ServiceMainItem[];
  recommendedProjectRequest: ServiceMainItem[];
  moveitPopularProjectExpert: ExpertMainItem[];
  moveitPopularCoaching: ExpertMainItem[];
}

export interface ServiceCandidateItem {
  serviceId: string;
  title: string;
  category: ServiceType;
  businessName: string | null;
  status: ServiceStatus;
  servicePrice: number;
  createdAt: string;
  orderCount: number;
  isAlreadyRegistered: boolean;
}

export interface ExpertCandidateItem {
  userId: string;
  businessName: string | null;
  email: string;
  specialties: ServiceType[];
  provider: Provider;
  isApproved: boolean;
  region: string | null;
  saleCount: number;
  reportCount: number;
  createdAt: string;
  isAlreadyRegistered: boolean;
}

export interface RegisteredServiceItem {
  serviceId: string;
  title: string;
}

export interface RegisteredExpertItem {
  userId: string;
  businessName: string | null;
}

export interface ServiceCandidatesResponse {
  items: ServiceCandidateItem[];
  pagination: Pagination;
  registered: RegisteredServiceItem[];
}

export interface ExpertCandidatesResponse {
  items: ExpertCandidateItem[];
  pagination: Pagination;
  registered: RegisteredExpertItem[];
}
