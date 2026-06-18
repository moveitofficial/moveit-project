import { api } from '@repo/fetcher';

import type { ApiSuccess, PaginatedResult, TechStackName } from '@/mocks/types';

export interface FavoriteServiceItem {
  id: string;
  title: string;
  servicePrice: number;
  workDuration: number;
  revisionCount: number;
  thumbnailUrl: string;
  status: string;
  expert: {
    id: string;
    companyName: string;
    profileImageUrl: string | null;
    region: string | null;
  };
  techStacks: TechStackName[];
  rating: number;
  reviewCount: number;
  orderCount: number;
}

export interface FavoriteExpertItem {
  id: string;
  companyName: string;
  foundedYear: number | null;
  profileImageUrl: string | null;
  techStacks: TechStackName[];
  serviceGroups: string[];
  rating: number;
  reviewCount: number;
}

// 찜 목록은 한 화면에 모두 보여주므로 넉넉히 한 번에 가져온다.
const FAVORITES_PAGE_SIZE = 100;

export function getFavoriteServices(): Promise<
  ApiSuccess<PaginatedResult<FavoriteServiceItem>>
> {
  return api.get<ApiSuccess<PaginatedResult<FavoriteServiceItem>>>(
    `/favorites/services?page=1&pageSize=${String(FAVORITES_PAGE_SIZE)}`,
  );
}

export function getFavoriteExperts(): Promise<
  ApiSuccess<PaginatedResult<FavoriteExpertItem>>
> {
  return api.get<ApiSuccess<PaginatedResult<FavoriteExpertItem>>>(
    `/favorites/experts?page=1&pageSize=${String(FAVORITES_PAGE_SIZE)}`,
  );
}
