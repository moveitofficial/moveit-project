import { api } from '@repo/fetcher';

import type {
  ExpertCandidateItem,
  ExpertCandidatesResponse,
  MainSectionType,
  MainSettingsResponse,
  ServiceCandidateItem,
  ServiceCandidatesResponse,
} from './types';
import type { PickerCandidatesData } from '@/components/common/modal/ItemPickerModal';
import type { ApiSuccess } from '@/types/api';

export interface GetCandidatesParams {
  sectionType: MainSectionType;
  search?: string;
  sort?: 'sales' | 'created';
  page?: number;
  pageSize?: number;
}

export function getMainSettings(): Promise<ApiSuccess<MainSettingsResponse>> {
  return api.get<ApiSuccess<MainSettingsResponse>>('/admin/main-settings');
}

function appendOptionalParams(
  query: URLSearchParams,
  params: { search?: string; sort?: string; page?: number; pageSize?: number },
) {
  if (params.search !== undefined) {
    query.set('search', params.search);
  }
  if (params.sort !== undefined) {
    query.set('sort', params.sort);
  }
  if (params.page !== undefined) {
    query.set('page', String(params.page));
  }
  if (params.pageSize !== undefined) {
    query.set('pageSize', String(params.pageSize));
  }
}

export function getServiceCandidates(
  params: GetCandidatesParams,
): Promise<ApiSuccess<ServiceCandidatesResponse>> {
  const query = new URLSearchParams({ sectionType: params.sectionType });
  appendOptionalParams(query, params);
  return api.get<ApiSuccess<ServiceCandidatesResponse>>(
    `/admin/main-settings/services/candidates?${query.toString()}`,
  );
}

export function getExpertCandidates(
  params: GetCandidatesParams,
): Promise<ApiSuccess<ExpertCandidatesResponse>> {
  const query = new URLSearchParams({ sectionType: params.sectionType });
  appendOptionalParams(query, params);
  return api.get<ApiSuccess<ExpertCandidatesResponse>>(
    `/admin/main-settings/experts/candidates?${query.toString()}`,
  );
}

export async function getServiceCandidatesForPicker(
  params: GetCandidatesParams,
): Promise<ApiSuccess<PickerCandidatesData<ServiceCandidateItem>>> {
  const res = await getServiceCandidates(params);
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

export async function getExpertCandidatesForPicker(
  params: GetCandidatesParams,
): Promise<ApiSuccess<PickerCandidatesData<ExpertCandidateItem>>> {
  const res = await getExpertCandidates(params);
  return {
    ...res,
    data: {
      items: res.data.items,
      pagination: res.data.pagination,
      registered: res.data.registered.map((entry) => ({
        id: entry.userId,
        label: entry.businessName ?? '-',
      })),
    },
  };
}

export function registerMainSetting(body: {
  sectionType: MainSectionType;
  targetIds: string[];
}): Promise<ApiSuccess<void>> {
  return api.post<ApiSuccess<void>>('/admin/main-settings', body);
}

export function deleteMainSetting(body: {
  sectionType: MainSectionType;
  mainSettingIds: string[];
}): Promise<ApiSuccess<void>> {
  return api.delete<ApiSuccess<void>>('/admin/main-settings', body);
}

export function deleteBanners(body: {
  bannerIds: string[];
}): Promise<ApiSuccess<void>> {
  return api.delete<ApiSuccess<void>>('/admin/main-settings/banners', body);
}
