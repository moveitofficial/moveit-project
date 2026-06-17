import { api } from '@repo/fetcher';

import type { PaginatedResult, TechStackName } from '@/mocks/types';
import type { ApiSuccess } from '@/types/api';

export type ServiceStatus = 'ACTIVE' | 'PAUSED' | 'CLOSED';

export interface MyServiceItem {
  id: string;
  title: string;
  servicePrice: number;
  thumbnailUrl: string;
  status: ServiceStatus;
  techStacks: TechStackName[];
  rating: number;
  reviewCount: number;
  orderCount: number;
}

export function getMyServices(
  page = 1,
): Promise<ApiSuccess<PaginatedResult<MyServiceItem>>> {
  return api.get<ApiSuccess<PaginatedResult<MyServiceItem>>>(
    `/users/me/services?page=${String(page)}`,
  );
}

// 판매 상태 변경 (ACTIVE 판매중 / PAUSED 판매중지)
export function updateServiceStatus(
  serviceId: string,
  status: 'ACTIVE' | 'PAUSED',
): Promise<ApiSuccess<unknown>> {
  return api.patch<ApiSuccess<unknown>>(`/services/${serviceId}/status`, {
    status,
  });
}

export function deleteService(serviceId: string): Promise<ApiSuccess<unknown>> {
  return api.delete<ApiSuccess<unknown>>(`/services/${serviceId}`);
}
