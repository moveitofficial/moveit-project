import { api } from '@repo/fetcher';

import type { MyCommentSort } from './constants';
import type { CommunityCategory, PaginatedResult } from '@/mocks/types';
import type { ApiSuccess } from '@/types/api';

export interface MyCommentPostSummary {
  id: string;
  category: CommunityCategory;
  title: string;
  likeCount: number;
}

export interface MyCommentListItem {
  id: string;
  content: string;
  createdAt: string;
  post: MyCommentPostSummary;
}

export interface GetMyCommentsParams {
  page: number;
  pageSize: number;
  sort?: MyCommentSort;
}

function buildMyCommentsQuery(params: GetMyCommentsParams): string {
  const search = new URLSearchParams();
  search.set('page', String(params.page));
  search.set('pageSize', String(params.pageSize));
  if (params.sort !== undefined) {
    search.set('sort', params.sort);
  }
  return search.toString();
}

export function getMyComments(
  params: GetMyCommentsParams,
): Promise<ApiSuccess<PaginatedResult<MyCommentListItem>>> {
  return api.get<ApiSuccess<PaginatedResult<MyCommentListItem>>>(
    `/users/me/comments?${buildMyCommentsQuery(params)}`,
  );
}

export function updateCommunityComment(
  postId: string,
  commentId: string,
  body: { content: string },
): Promise<ApiSuccess<{ id: string; content: string }>> {
  return api.patch<ApiSuccess<{ id: string; content: string }>>(
    `/community-posts/${postId}/comments/${commentId}`,
    body,
  );
}

export function deleteCommunityComment(
  postId: string,
  commentId: string,
): Promise<ApiSuccess<{ id: string }>> {
  return api.delete<ApiSuccess<{ id: string }>>(
    `/community-posts/${postId}/comments/${commentId}`,
  );
}
