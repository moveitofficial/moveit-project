import { api } from '@repo/fetcher';

import type {
  CategoryFeaturedPageResponse,
  ServiceCandidateItem,
  ServiceCandidatesResponse,
} from './types';
import type { PickerCandidatesData } from '@/components/common/modal/ItemPickerModal';
import type { ApiSuccess } from '@/types/api';
import type { ServiceType } from '@/types/enums';

export interface GetCategoryFeaturedCandidatesParams {
  serviceGroup: ServiceType;
  search?: string;
  sort?: 'sales' | 'created';
  page?: number;
  pageSize?: number;
}

export function getCategoryFeatured(): Promise<
  ApiSuccess<CategoryFeaturedPageResponse>
> {
  return api.get<ApiSuccess<CategoryFeaturedPageResponse>>(
    '/admin/category-featured',
  );
}

function appendOptionalParams(
  query: URLSearchParams,
  params: { search?: string; sort?: string; page?: number; pageSize?: number },
) {
  if (params.search !== undefined) query.set('search', params.search);
  if (params.sort !== undefined) query.set('sort', params.sort);
  if (params.page !== undefined) query.set('page', String(params.page));
  if (params.pageSize !== undefined) query.set('pageSize', String(params.pageSize));
}

export function getCategoryFeaturedCandidates(
  params: GetCategoryFeaturedCandidatesParams,
): Promise<ApiSuccess<ServiceCandidatesResponse>> {
  const query = new URLSearchParams({ serviceGroup: params.serviceGroup });
  appendOptionalParams(query, params);
  return api.get<ApiSuccess<ServiceCandidatesResponse>>(
    `/admin/category-featured/candidates?${query.toString()}`,
  );
}

export async function getCategoryFeaturedCandidatesForPicker(
  params: GetCategoryFeaturedCandidatesParams,
): Promise<ApiSuccess<PickerCandidatesData<ServiceCandidateItem>>> {
  const res = await getCategoryFeaturedCandidates(params);
  return {
    ...res,
    data: {
      items: res.data.items,
      pagination: res.data.pagination,
      registered: res.data.registered.map((entry) => ({
        id: entry.serviceId,
        label: entry.title,
      })),
    },
  };
}

export function registerCategoryFeatured(body: {
  serviceGroup: ServiceType;
  serviceIds: string[];
}): Promise<ApiSuccess<void>> {
  return api.post<ApiSuccess<void>>('/admin/category-featured', body);
}

export function deleteCategoryFeatured(body: {
  serviceGroup: ServiceType;
  categoryFeaturedIds: string[];
}): Promise<ApiSuccess<void>> {
  return api.delete<ApiSuccess<void>>('/admin/category-featured', body);
}
