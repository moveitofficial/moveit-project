'use client';

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  deleteCommunityComment,
  getMyComments,
  type MyCommentListItem,
} from './api';
import {
  MY_COMMENT_PAGE_SIZE,
  type MyCommentSort,
} from './constants';

export const MY_COMMENTS_QUERY_KEY = ['users', 'me', 'comments'] as const;

export function useMyCommentsInfinite(sort: MyCommentSort) {
  return useInfiniteQuery({
    queryKey: [...MY_COMMENTS_QUERY_KEY, 'list', sort],
    queryFn: ({ pageParam }) =>
      getMyComments({
        page: pageParam,
        pageSize: MY_COMMENT_PAGE_SIZE,
        sort,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.data.pagination.hasNext ? allPages.length + 1 : undefined,
  });
}

export function useDeleteMyCommentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      postId,
      commentId,
    }: {
      postId: string;
      commentId: string;
    }) => deleteCommunityComment(postId, commentId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: MY_COMMENTS_QUERY_KEY });
    },
  });
}

export function flattenMyCommentPages(
  pages: { data: { items: MyCommentListItem[] } }[] | undefined,
): MyCommentListItem[] {
  return pages?.flatMap((page) => page.data.items) ?? [];
}
