import { api, ApiError } from '@repo/fetcher';

import {
  MOCK_EXPERT_CONTACT_TIME,
  SERVICE_DETAIL_PORTFOLIO_PREVIEW_COUNT,
  SERVICE_DETAIL_REVIEW_PAGE_SIZE,
} from './constants';

import type {
  ServiceDetailPageData,
  ServiceDetailReviewResult,
  ServiceDetailReviewSort,
} from './types';
import type {
  ApiSuccess,
  BusinessSector,
  ExpertStats,
  PaginatedResult,
  PortfolioListItem,
  Region,
  Review,
  ServiceDetail,
  ServiceImage,
  ServiceListItem,
  TechStackName,
} from '@/mocks/types';

interface ServiceImageApi {
  id: string;
  imgUrl: string;
  isMain: boolean;
}

interface ServiceDetailApi {
  id: string;
  title: string;
  workDuration: number;
  revisionCount: number;
  serviceScope: string;
  servicePrice: number;
  description: string;
  preparationNotes: string;
  refundPolicy: string;
  status: ServiceDetail['status'];
  categoryRef: ServiceDetail['categoryRef'];
  isFavorite: boolean;
  expert: ServiceDetail['expert'];
  images: ServiceImageApi[];
  techStacks: TechStackName[];
  steps: ServiceDetail['steps'];
  faqs: ServiceDetail['faqs'];
  orderCount: number;
  favoriteCount: number;
  purchaseRate: number | null;
  totalAmount: number;
}

interface ServiceListItemApi {
  id: string;
  title: string;
  servicePrice: number;
  workDuration: number;
  revisionCount: number;
  thumbnailUrl: string;
  status: ServiceListItem['status'];
  expert: ServiceListItem['expert'] & { region?: Region | null };
  categoryRef: ServiceListItem['categoryRef'];
  techStacks: TechStackName[];
  rating: number;
  reviewCount: number;
}

interface ServiceReviewsApi extends PaginatedResult<Review> {
  averageRating: number;
}

interface PortfolioListApi {
  count: number;
  items: {
    id: string;
    title: string;
    thumbnailUrl: string | null;
  }[];
}

const FALLBACK_EXPERT_STATS: ExpertStats = {
  totalReviews: 0,
  averageRating: 0,
  purchaseRate: 0,
  completionRate: 100,
};

const SERVICE_FALLBACK_THUMBNAIL =
  'https://picsum.photos/seed/moveit-fallback/400/300';

function resolveThumbnailUrl(thumbnailUrl: string): string {
  return thumbnailUrl.trim().length > 0
    ? thumbnailUrl
    : SERVICE_FALLBACK_THUMBNAIL;
}

function mapServiceImages(images: ServiceImageApi[]): ServiceImage[] {
  if (images.length === 0) {
    return [
      {
        id: 'fallback-thumbnail',
        url: SERVICE_FALLBACK_THUMBNAIL,
        isMain: true,
      },
    ];
  }

  return images.map((image) => ({
    id: image.id,
    url: resolveThumbnailUrl(image.imgUrl),
    isMain: image.isMain,
  }));
}

function mapServiceListItem(item: ServiceListItemApi): ServiceListItem {
  return {
    id: item.id,
    title: item.title,
    servicePrice: item.servicePrice,
    workDuration: item.workDuration,
    revisionCount: item.revisionCount,
    thumbnailUrl: resolveThumbnailUrl(item.thumbnailUrl),
    status: item.status,
    expert: item.expert,
    categoryRef: item.categoryRef,
    rating: item.rating,
    reviewCount: item.reviewCount,
    isFavorite: false,
  };
}

function mapPortfolioItem(
  item: PortfolioListApi['items'][number],
): PortfolioListItem {
  return {
    id: item.id,
    title: item.title,
    thumbnailUrl: item.thumbnailUrl ?? '',
    clientName: '',
    businessSector: 'PUBLIC_INSTITUTION' satisfies BusinessSector,
  };
}

function buildReviewsQuery(
  page: number,
  pageSize: number,
  sort: ServiceDetailReviewSort,
): string {
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    sort,
  });

  return query.toString();
}

async function fetchServiceDetail(
  serviceId: string,
): Promise<ServiceDetailApi | null> {
  try {
    const response = await api.get<ApiSuccess<ServiceDetailApi>>(
      `/services/${serviceId}`,
    );

    return response.data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
}

async function fetchServiceReviewsPage(
  serviceId: string,
  page: number,
  pageSize: number,
  sort: ServiceDetailReviewSort,
): Promise<ServiceReviewsApi> {
  const response = await api.get<ApiSuccess<ServiceReviewsApi>>(
    `/services/${serviceId}/reviews?${buildReviewsQuery(page, pageSize, sort)}`,
  );

  return response.data;
}

async function fetchOtherServices(serviceId: string): Promise<{
  items: ServiceListItem[];
  techStacksByServiceId: Record<string, TechStackName[]>;
}> {
  try {
    const response = await api.get<ApiSuccess<ServiceListItemApi[]>>(
      `/services/${serviceId}/others`,
    );

    const techStacksByServiceId: Record<string, TechStackName[]> = {};

    const items = response.data.map((item) => {
      techStacksByServiceId[item.id] = item.techStacks;

      return mapServiceListItem(item);
    });

    return { items, techStacksByServiceId };
  } catch {
    return { items: [], techStacksByServiceId: {} };
  }
}

async function fetchExpertPortfolios(
  expertUserId: string,
): Promise<{ items: PortfolioListItem[]; hasMore: boolean }> {
  try {
    const response = await api.get<ApiSuccess<PortfolioListApi>>(
      `/users/${expertUserId}/portfolios`,
    );

    const items = response.data.items.map((item) => mapPortfolioItem(item));

    return {
      items: items.slice(0, SERVICE_DETAIL_PORTFOLIO_PREVIEW_COUNT),
      hasMore: response.data.count > SERVICE_DETAIL_PORTFOLIO_PREVIEW_COUNT,
    };
  } catch {
    return { items: [], hasMore: false };
  }
}

function buildServiceDetailModel(
  detail: ServiceDetailApi,
  reviews: ServiceReviewsApi,
  recommendedServices: ServiceListItem[],
): ServiceDetail {
  return {
    id: detail.id,
    title: detail.title,
    workDuration: detail.workDuration,
    revisionCount: detail.revisionCount,
    serviceScope: detail.serviceScope,
    servicePrice: detail.servicePrice,
    description: detail.description,
    preparationNotes: detail.preparationNotes,
    refundPolicy: detail.refundPolicy,
    status: detail.status,
    categoryRef: detail.categoryRef,
    isFavorite: detail.isFavorite,
    expert: detail.expert,
    images: mapServiceImages(detail.images),
    techStacks: detail.techStacks,
    steps: detail.steps,
    faqs: detail.faqs,
    reviews: {
      items: reviews.items,
      totalCount: reviews.pagination.totalCount,
      averageRating: reviews.averageRating,
    },
    recommendedServices,
  };
}

export async function fetchServiceReviews(
  serviceId: string,
  params: {
    page: number;
    pageSize?: number;
    sort: ServiceDetailReviewSort;
  },
): Promise<ServiceDetailReviewResult> {
  const pageSize = params.pageSize ?? SERVICE_DETAIL_REVIEW_PAGE_SIZE;
  const reviews = await fetchServiceReviewsPage(
    serviceId,
    params.page,
    pageSize,
    params.sort,
  );

  return {
    items: reviews.items,
    totalCount: reviews.pagination.totalCount,
    averageRating: reviews.averageRating,
    hasMore: reviews.pagination.hasNext,
  };
}

export async function getServiceDetailPageData(
  serviceId: string,
): Promise<ServiceDetailPageData | null> {
  const detail = await fetchServiceDetail(serviceId);

  if (detail === null) {
    return null;
  }

  const [reviews, otherServices, portfolioResult] = await Promise.all([
    fetchServiceReviewsPage(
      serviceId,
      1,
      SERVICE_DETAIL_REVIEW_PAGE_SIZE,
      'latest',
    ),
    fetchOtherServices(serviceId),
    fetchExpertPortfolios(detail.expert.id),
  ]);

  const service = buildServiceDetailModel(
    detail,
    reviews,
    otherServices.items,
  );

  const expertStats: ExpertStats = {
    ...FALLBACK_EXPERT_STATS,
    totalReviews: reviews.pagination.totalCount,
    averageRating: reviews.averageRating,
    purchaseRate: detail.purchaseRate ?? 0,
  };

  return {
    service,
    expertStats,
    orderCount: detail.orderCount,
    favoriteCount: detail.favoriteCount,
    portfolios: portfolioResult.items,
    portfoliosHasMore: portfolioResult.hasMore,
    contactTime: MOCK_EXPERT_CONTACT_TIME,
    reviewsHasMore: reviews.pagination.hasNext,
    relatedServiceTechStacks: otherServices.techStacksByServiceId,
    totalAmount: detail.totalAmount,
  };
}
