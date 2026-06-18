import { api } from '@repo/fetcher';

import type { MyReviewSort } from './constants';
import type { PaginatedResult } from '@/mocks/types';
import type { ApiSuccess } from '@/types/api';

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isReviewUuid(value: string | undefined): value is string {
  return value !== undefined && UUID_PATTERN.test(value);
}

export interface MyReviewExpert {
  id: string;
  name: string;
  profileImageUrl: string | null;
  companyName: string;
}

export interface MyReviewListItem {
  id: string;
  orderId: string;
  rating: number;
  content: string;
  createdAt: string;
  serviceTitle: string;
  expert: MyReviewExpert;
}

export interface GetMyReviewsParams {
  page: number;
  pageSize: number;
  sort?: MyReviewSort;
}

function buildMyReviewsQuery(params: GetMyReviewsParams): string {
  const search = new URLSearchParams();
  search.set('page', String(params.page));
  search.set('pageSize', String(params.pageSize));
  if (params.sort !== undefined) {
    search.set('sort', params.sort);
  }
  return search.toString();
}

export function getMyReviews(
  params: GetMyReviewsParams,
): Promise<ApiSuccess<PaginatedResult<MyReviewListItem>>> {
  return api.get<ApiSuccess<PaginatedResult<MyReviewListItem>>>(
    `/users/me/reviews?${buildMyReviewsQuery(params)}`,
  );
}

export function deleteMyReview(
  orderId: string,
  reviewId: string,
): Promise<ApiSuccess<null>> {
  if (!isReviewUuid(orderId) || !isReviewUuid(reviewId)) {
    return Promise.reject(
      new Error('리뷰 정보가 올바르지 않습니다. 페이지를 새로고침한 후 다시 시도해 주세요.'),
    );
  }
  return api.delete<ApiSuccess<null>>(`/orders/${orderId}/reviews/${reviewId}`);
}

export function updateMyReview(
  orderId: string,
  reviewId: string,
  body: { rating: number; content: string },
): Promise<
  ApiSuccess<{
    id: string;
    rating: number;
    content: string;
    createdAt: string;
  }>
> {
  if (!isReviewUuid(orderId) || !isReviewUuid(reviewId)) {
    return Promise.reject(
      new Error('리뷰 정보가 올바르지 않습니다. 페이지를 새로고침한 후 다시 시도해 주세요.'),
    );
  }
  return api.patch<
    ApiSuccess<{
      id: string;
      rating: number;
      content: string;
      createdAt: string;
    }>
  >(`/orders/${orderId}/reviews/${reviewId}`, body);
}
