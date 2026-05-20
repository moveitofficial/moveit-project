import { mockExpertList } from './experts';
import { mockServiceList } from './services';

import type { ApiSuccess, ExpertDetail, PaginatedResult, ServiceListItem } from './types';

export const mockFavoriteServices: ServiceListItem[] = mockServiceList
  .filter((s) => s.isFavorite)
  .map((s) => ({ ...s, isFavorite: true }));

export const mockFavoriteExperts: ExpertDetail[] = mockExpertList
  .filter((e) => e.isFavorite)
  .map((e) => ({ ...e, isFavorite: true }));

export const mockFavoriteServicesResponse: ApiSuccess<PaginatedResult<ServiceListItem>> = {
  success: true,
  message: '요청 성공',
  data: {
    items: mockFavoriteServices,
    pagination: { page: 1, pageSize: 20, totalCount: mockFavoriteServices.length, hasNext: false },
  },
};

export const mockFavoriteExpertsResponse: ApiSuccess<PaginatedResult<ExpertDetail>> = {
  success: true,
  message: '요청 성공',
  data: {
    items: mockFavoriteExperts,
    pagination: { page: 1, pageSize: 20, totalCount: mockFavoriteExperts.length, hasNext: false },
  },
};
