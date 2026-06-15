import { api, publicApi } from '@repo/fetcher';

import type {
  CommunityCategory,
  Region,
  ServiceCategoryName,
  ServiceGroupName,
  TechStackName,
} from '@/mocks/types';
import type { ApiSuccess } from '@/types/api';

export interface MainServiceItem {
  id: string;
  title: string;
  servicePrice: number;
  workDuration: number;
  revisionCount: number;
  thumbnailUrl: string;
  expert: {
    id: string;
    name: string;
    companyName: string;
  };
  categoryRef: {
    group: ServiceGroupName;
    category: ServiceCategoryName;
  };
  rating: number;
  reviewCount: number;
  techStacks: TechStackName[];
}

export interface MainExpertItem {
  userId: string;
  name: string | null;
  businessName: string | null;
  profileImageUrl: string | null;
  region: Region | null;
  rating: number;
  reviewCount: number;
  techStacks: TechStackName[];
  specialty: ServiceGroupName | null;
}

export interface MainBanner {
  id: string;
  imageUrl: string;
  actionUrl: string;
}

export interface MainSections {
  popularItCoaching: MainServiceItem[];
  popularProjectRequest: MainServiceItem[];
  moveitPopularProjectExpert: MainExpertItem[];
  moveitPopularCoaching: MainExpertItem[];
  recommendedItCoaching: MainServiceItem[];
  recommendedProjectRequest: MainServiceItem[];
  banner: MainBanner | null;
}

export interface PopularPost {
  id: string;
  userId: string;
  category: CommunityCategory;
  title: string;
  content: string;
  createdAt: string;
  authorDisplayName: string;
  likeCount: number;
  commentCount: number;
}

// 공개 (비로그인 가능)
export function getMainSections(): Promise<ApiSuccess<MainSections>> {
  return publicApi.get<ApiSuccess<MainSections>>('/main/sections');
}

export function getRecentServices(): Promise<ApiSuccess<MainServiceItem[]>> {
  return publicApi.get<ApiSuccess<MainServiceItem[]>>('/services/recent');
}

export function getPopularPosts(): Promise<ApiSuccess<PopularPost[]>> {
  return publicApi.get<ApiSuccess<PopularPost[]>>('/community-posts/popular');
}

// 로그인 필요 (관심사·지역·최근본). 데이터 없으면 빈 배열.
export function getRecommendedByInterest(): Promise<
  ApiSuccess<MainServiceItem[]>
> {
  return api.get<ApiSuccess<MainServiceItem[]>>(
    '/services/recommended-by-interest',
  );
}

export function getServicesByRegion(): Promise<ApiSuccess<MainServiceItem[]>> {
  return api.get<ApiSuccess<MainServiceItem[]>>('/services/by-region');
}

export function getRecentlyViewedServices(): Promise<
  ApiSuccess<MainServiceItem[]>
> {
  return api.get<ApiSuccess<MainServiceItem[]>>(
    '/users/me/recently-viewed-services',
  );
}
