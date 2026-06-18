'use client';

import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  deleteMyReview,
  getMyReviews,
  updateMyReview,
  type MyReviewListItem,
} from './api';
import { MY_REVIEW_PAGE_SIZE, type MyReviewSort } from './constants';

export const MY_REVIEWS_QUERY_KEY = ['users', 'me', 'reviews', 'v2'] as const;

export function useMyReviewsInfinite(sort: MyReviewSort) {
  return useInfiniteQuery({
    queryKey: [...MY_REVIEWS_QUERY_KEY, 'list', sort],
    queryFn: ({ pageParam }) =>
      getMyReviews({
        page: pageParam,
        pageSize: MY_REVIEW_PAGE_SIZE,
        sort,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.data.pagination.hasNext ? allPages.length + 1 : undefined,
    refetchOnMount: 'always',
  });
}

export function useDeleteMyReviewMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, reviewId }: { orderId: string; reviewId: string }) =>
      deleteMyReview(orderId, reviewId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: MY_REVIEWS_QUERY_KEY });
    },
  });
}

export function useUpdateMyReviewMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      orderId,
      reviewId,
      rating,
      content,
    }: {
      orderId: string;
      reviewId: string;
      rating: number;
      content: string;
    }) => updateMyReview(orderId, reviewId, { rating, content }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: MY_REVIEWS_QUERY_KEY });
    },
  });
}

export function flattenMyReviewPages(
  pages: { data: { items: MyReviewListItem[] } }[] | undefined,
): MyReviewListItem[] {
  return pages?.flatMap((page) => page.data.items) ?? [];
}
