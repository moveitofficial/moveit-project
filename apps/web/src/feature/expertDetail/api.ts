import { api, ApiError, publicApi } from '@repo/fetcher';

import {
  buildExpertBusinessInfo,
  buildExpertDisplayStats,
  resolveExpertDetailViewer,
} from './utils';

import type { ExpertDetailPageResult, ExpertReportReason } from './types';
import type {
  ApiSuccess,
  ExpertSummary,
  PaginatedResult,
  Region,
  ServiceListItem,
  ServiceStatus,
  TechStackName,
} from '@/mocks/types';
import type { Role } from '@/types/enums';

import { getExpertPortfolioList } from '@/feature/portfolioDetail/api';
import { getMe } from '@/feature/signup/api';

const BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
).replace(/\/$/, '');

const SERVICE_FALLBACK_THUMBNAIL =
  'https://picsum.photos/seed/moveit-fallback/400/300';

interface ExpertDetailApi {
  id: string;
  profileImageUrl: string | null;
  region: Region | null;
  businessName: string | null;
  ceoName: string | null;
  description: string | null;
  foundedYear: number | null;
  employeeMin: number | null;
  employeeMax: number | null;
  contactTimeStart: string | null;
  contactTimeEnd: string | null;
  avgRating: number | null;
  reviewCount: number;
  techStacks: TechStackName[];
  clientNames: string[];
  totalOrderCount: number;
  serviceCount: number;
  topPurchaseRate: number | null;
  completionRate: number | null;
  isFavorite: boolean;
  favoriteCount: number;
}

interface ExpertServiceListItemApi {
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

interface ServiceCategoryRefApi {
  group: ServiceListItem['categoryRef']['group'];
  category: ServiceListItem['categoryRef']['category'];
}

interface ServiceCategoryDetailApi {
  workDuration: number;
  revisionCount: number;
  categoryRef: ServiceCategoryRefApi;
}

interface UploadReportImagesResponse {
  reportId: string;
  images: { key: string; url: string }[];
}

function resolveThumbnailUrl(thumbnailUrl: string): string {
  return thumbnailUrl.trim().length > 0
    ? thumbnailUrl
    : SERVICE_FALLBACK_THUMBNAIL;
}

async function getOptionalAuthData<T>(path: string): Promise<T> {
  try {
    const response = await api.get<ApiSuccess<T>>(path);
    return response.data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      const response = await publicApi.get<ApiSuccess<T>>(path);
      return response.data;
    }

    throw error;
  }
}

async function fetchExpertDetailApi(
  expertUserId: string,
): Promise<ExpertDetailApi | null> {
  try {
    return await getOptionalAuthData<ExpertDetailApi>(`/users/${expertUserId}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
}

async function fetchServiceCategoryDetail(
  serviceId: string,
): Promise<ServiceCategoryDetailApi | null> {
  try {
    const data = await getOptionalAuthData<{
      workDuration: number;
      revisionCount: number;
      categoryRef: ServiceCategoryRefApi;
    }>(`/services/${serviceId}`);

    return {
      workDuration: data.workDuration,
      revisionCount: data.revisionCount,
      categoryRef: data.categoryRef,
    };
  } catch {
    return null;
  }
}

async function fetchExpertServices(
  expertUserId: string,
  expertSummary: ExpertSummary,
): Promise<ServiceListItem[]> {
  try {
    const response = await api.get<
      ApiSuccess<PaginatedResult<ExpertServiceListItemApi>>
    >(`/users/${expertUserId}/services?page=1&pageSize=50`);

    return await Promise.all(
      response.data.items.map(async (item) => {
        const detail = await fetchServiceCategoryDetail(item.id);

        return {
          id: item.id,
          title: item.title,
          servicePrice: item.servicePrice,
          workDuration: detail?.workDuration ?? 0,
          revisionCount: detail?.revisionCount ?? 0,
          thumbnailUrl: resolveThumbnailUrl(item.thumbnailUrl),
          status: item.status,
          expert: expertSummary,
          categoryRef: detail?.categoryRef ?? {
            group: 'IT_COACHING',
            category: 'WEB',
          },
          rating: item.rating,
          reviewCount: item.reviewCount,
          isFavorite: false,
        };
      }),
    );
  } catch {
    return [];
  }
}

async function getCurrentUserForViewer(): Promise<{
  id: string;
  role: Role;
} | null> {
  try {
    const { data } = await getMe();
    return { id: data.id, role: data.role };
  } catch {
    return null;
  }
}

async function multipartPost<T>(path: string, formData: FormData): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => ({}))) as {
      message?: string;
    };
    throw new ApiError(
      response.status,
      error.message ?? '요청 중 오류가 발생했습니다.',
    );
  }

  const json = (await response.json()) as ApiSuccess<T>;
  return json.data;
}

export async function getExpertDetailPageResult(
  expertUserId: string,
): Promise<ExpertDetailPageResult | null> {
  const [detail, portfolios, currentUser] = await Promise.all([
    fetchExpertDetailApi(expertUserId),
    getExpertPortfolioList(expertUserId),
    getCurrentUserForViewer(),
  ]);

  if (detail === null) {
    return null;
  }

  const companyName = detail.businessName ?? '전문가';
  const expertSummary: ExpertSummary = {
    id: expertUserId,
    name: companyName,
    companyName,
    profileImageUrl: detail.profileImageUrl,
  };

  const services = await fetchExpertServices(expertUserId, expertSummary);

  const expert = {
    id: expertUserId,
    name: companyName,
    companyName,
    ceoName: detail.ceoName ?? undefined,
    description: detail.description ?? '',
    profileImageUrl: detail.profileImageUrl,
    isFavorite: detail.isFavorite,
    stats: {
      totalReviews: detail.reviewCount,
      averageRating: detail.avgRating,
      purchaseRate: detail.topPurchaseRate,
      completionRate: detail.completionRate,
    },
    specialtyCategories: [],
    techStacks: detail.techStacks,
    portfolios,
    services,
    clientNames: detail.clientNames,
    foundedYear: detail.foundedYear ?? undefined,
    region: detail.region,
    employeeMin: detail.employeeMin,
    employeeMax: detail.employeeMax,
    contactTimeStart: detail.contactTimeStart ?? undefined,
    contactTimeEnd: detail.contactTimeEnd ?? undefined,
    totalOrderCount: detail.totalOrderCount,
    serviceCount: detail.serviceCount,
  };

  const viewer = resolveExpertDetailViewer(currentUser, expertUserId);
  const contactTimeStart = detail.contactTimeStart ?? '09:00';
  const contactTimeEnd = detail.contactTimeEnd ?? '18:00';

  return {
    data: {
      expert,
      displayStats: buildExpertDisplayStats(expert),
      businessInfo: buildExpertBusinessInfo(expert),
      portfolios,
      services,
      favoriteCount: detail.favoriteCount,
      portfolioExpertContext: {
        companyName,
        contactTime: {
          start: contactTimeStart,
          end: contactTimeEnd,
        },
      },
    },
    viewer,
  };
}

export async function addFavoriteExpert(expertUserId: string): Promise<void> {
  await api.post<ApiSuccess<unknown>>(`/favorites/experts/${expertUserId}`, {});
}

export async function removeFavoriteExpert(expertUserId: string): Promise<void> {
  await api.delete<ApiSuccess<unknown>>(`/favorites/experts/${expertUserId}`);
}

export async function uploadReportImages(
  files: File[],
): Promise<UploadReportImagesResponse> {
  const formData = new FormData();
  for (const file of files) {
    formData.append('reportImages', file);
  }

  return multipartPost<UploadReportImagesResponse>('/reports/upload', formData);
}

export async function createExpertReport(params: {
  reportId?: string;
  reportedUserId: string;
  reason: ExpertReportReason;
  detail: string;
  imageUrls?: string[];
}): Promise<void> {
  await api.post<ApiSuccess<unknown>>('/reports', params);
}
