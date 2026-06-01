import type { CommunityFilter } from './constants';
import type {
  ApiSuccess,
  CommunityComment,
  CommunityPost,
  PaginatedResult,
} from '@/mocks/types';

import {
  mockCommunityComments,
  mockCommunityPostDetailResponse,
  mockCommunityPosts,
} from '@/mocks/community';


export interface GetPagedCommunityPostsParams {
  category: CommunityFilter['id'];
  page: number;
  pageSize: number;
}

export function getPagedCommunityPosts(
  params: GetPagedCommunityPostsParams,
): Promise<ApiSuccess<PaginatedResult<CommunityPost>>> {
  const filteredPosts =
    params.category === 'ALL'
      ? mockCommunityPosts
      : mockCommunityPosts.filter((post) => post.category === params.category);

  const totalCount = filteredPosts.length;
  const startIndex = (params.page - 1) * params.pageSize;
  const pagedItems = filteredPosts.slice(
    startIndex,
    startIndex + params.pageSize,
  );

  return Promise.resolve({
    success: true,
    message: '조회 성공',
    data: {
      items: pagedItems,
      pagination: {
        page: params.page,
        pageSize: params.pageSize,
        totalCount,
        hasNext: startIndex + params.pageSize < totalCount,
      },
    },
  });
}

export function getCommunityPostDetail(
  postId: string,
): Promise<{ post: CommunityPost; comments: CommunityComment[] } | null> {
  const post = mockCommunityPosts.find((item) => item.id === postId);
  if (!post) {
    return Promise.resolve(null);
  }

  const comments =
    postId === mockCommunityPostDetailResponse.data.id
      ? mockCommunityComments
      : [];

  return Promise.resolve({ post, comments });
}
