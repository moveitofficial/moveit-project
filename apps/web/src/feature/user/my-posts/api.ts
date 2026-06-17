import { api } from '@repo/fetcher';

import type { MyPostCategoryFilter, MyPostSort } from './constants';
import type { CommunityCategory, PaginatedResult } from '@/mocks/types';
import type { ApiSuccess } from '@/types/api';

export interface MyPostListItem {
  id: string;
  category: CommunityCategory;
  title: string;
  content: string;
  createdAt: string;
  authorDisplayName: string;
  likeCount: number;
  commentCount: number;
}

export interface GetMyPostsParams {
  page: number;
  pageSize: number;
  category?: MyPostCategoryFilter;
  sort?: MyPostSort;
}

function buildMyPostsQuery(params: GetMyPostsParams): string {
  const search = new URLSearchParams();
  search.set('page', String(params.page));
  search.set('pageSize', String(params.pageSize));
  if (params.sort !== undefined) {
    search.set('sort', params.sort);
  }
  if (params.category !== undefined && params.category !== 'ALL') {
    search.set('category', params.category);
  }
  return search.toString();
}

export function getMyPosts(
  params: GetMyPostsParams,
): Promise<ApiSuccess<PaginatedResult<MyPostListItem>>> {
  return api.get<ApiSuccess<PaginatedResult<MyPostListItem>>>(
    `/users/me/posts?${buildMyPostsQuery(params)}`,
  );
}

export interface UpdateCommunityPostBody {
  category?: CommunityCategory;
  title?: string;
  content?: string;
}

export function updateCommunityPost(
  postId: string,
  body: UpdateCommunityPostBody,
): Promise<
  ApiSuccess<{
    id: string;
    category: CommunityCategory;
    title: string;
    content: string;
  }>
> {
  return api.patch<
    ApiSuccess<{
      id: string;
      category: CommunityCategory;
      title: string;
      content: string;
    }>
  >(`/community-posts/${postId}`, body);
}

export function deleteCommunityPost(
  postId: string,
): Promise<ApiSuccess<{ id: string }>> {
  return api.delete<ApiSuccess<{ id: string }>>(`/community-posts/${postId}`);
}
