'use client';

import {
  useInfiniteQuery,
  useMutation,
  useQueries,
  useQueryClient,
} from '@tanstack/react-query';

import {
  deleteCommunityPost,
  getMyPosts,
  type MyPostListItem,
} from './api';
import {
  MY_POST_CATEGORY_FILTERS,
  MY_POST_PAGE_SIZE,
  type MyPostCategoryFilter,
  type MyPostSort,
} from './constants';

export const MY_POSTS_QUERY_KEY = ['users', 'me', 'posts'] as const;

export function useMyPostsInfinite(
  category: MyPostCategoryFilter,
  sort: MyPostSort,
) {
  return useInfiniteQuery({
    queryKey: [...MY_POSTS_QUERY_KEY, 'list', category, sort],
    queryFn: ({ pageParam }) =>
      getMyPosts({
        page: pageParam,
        pageSize: MY_POST_PAGE_SIZE,
        category,
        sort,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.data.pagination.hasNext ? allPages.length + 1 : undefined,
  });
}

export function useMyPostCategoryCounts(): Record<
  MyPostCategoryFilter,
  number | undefined
> {
  const results = useQueries({
    queries: MY_POST_CATEGORY_FILTERS.map((filter) => ({
      queryKey: [...MY_POSTS_QUERY_KEY, 'count', filter.id],
      queryFn: async () => {
        const response = await getMyPosts({
          page: 1,
          pageSize: 1,
          category: filter.id,
          sort: 'latest',
        });
        return response.data.pagination.totalCount;
      },
    })),
  });

  return MY_POST_CATEGORY_FILTERS.reduce<
    Record<MyPostCategoryFilter, number | undefined>
  >(
    (acc, filter, index) => {
      acc[filter.id] = results[index]?.data;
      return acc;
    },
    { ALL: undefined, QUESTION: undefined, TIP: undefined, REVIEW: undefined, STUDY_GROUP: undefined, FREE: undefined },
  );
}

export function useDeleteMyPostMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCommunityPost,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: MY_POSTS_QUERY_KEY });
    },
  });
}

export function flattenMyPostPages(
  pages: { data: { items: MyPostListItem[] } }[] | undefined,
): MyPostListItem[] {
  return pages?.flatMap((page) => page.data.items) ?? [];
}
