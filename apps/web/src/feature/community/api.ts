import { api } from '@repo/fetcher';

import type { CommunityFilter } from './constants';
import type {
  CommunityCategory,
  CommunityCommentItem,
  CommunityPaged,
  CommunityPostDetailItem,
  CommunityPostListItem,
} from './types';
import type { ApiSuccess } from '@/types/api';

export interface CreateCommunityPostBody {
  category: CommunityCategory;
  title: string;
  content: string;
}

// 게시글 작성. 부적절 단어 포함 시 400(CONTAINS_BANNED_WORD).
export function createCommunityPost(
  body: CreateCommunityPostBody,
): Promise<ApiSuccess<{ id: string }>> {
  return api.post<ApiSuccess<{ id: string }>>('/community-posts', body);
}

// 게시글 수정(작성자만). 비작성자는 403.
export function updateCommunityPost(
  postId: string,
  body: CreateCommunityPostBody,
): Promise<ApiSuccess<{ id: string }>> {
  return api.patch<ApiSuccess<{ id: string }>>(
    `/community-posts/${postId}`,
    body,
  );
}

// 게시글 삭제(작성자만). 비작성자는 403.
export function deleteCommunityPost(
  postId: string,
): Promise<ApiSuccess<{ id: string }>> {
  return api.delete<ApiSuccess<{ id: string }>>(`/community-posts/${postId}`);
}

export interface GetPagedCommunityPostsParams {
  category: CommunityFilter['id'];
  page: number;
  pageSize: number;
}

export function getPagedCommunityPosts(
  params: GetPagedCommunityPostsParams,
): Promise<ApiSuccess<CommunityPaged<CommunityPostListItem>>> {
  const query = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
  });
  // 'ALL'은 전체이므로 category 미전송.
  if (params.category !== 'ALL') {
    query.set('category', params.category);
  }
  return api.get<ApiSuccess<CommunityPaged<CommunityPostListItem>>>(
    `/community-posts?${query.toString()}`,
  );
}

// 좋아요 토글 — 응답의 isLiked로 최종 상태 동기화. (백엔드가 POST_LIKE 알림 발송)
export function toggleCommunityPostLike(
  postId: string,
): Promise<ApiSuccess<{ isLiked: boolean }>> {
  return api.post<ApiSuccess<{ isLiked: boolean }>>(
    `/community-posts/${postId}/like`,
    {},
  );
}

// 댓글 작성 (백엔드가 POST_COMMENT 알림 발송)
export function createCommunityComment(
  postId: string,
  content: string,
): Promise<ApiSuccess<unknown>> {
  return api.post<ApiSuccess<unknown>>(`/community-posts/${postId}/comments`, {
    content,
  });
}

export function updateCommunityComment(
  postId: string,
  commentId: string,
  content: string,
): Promise<ApiSuccess<unknown>> {
  return api.patch<ApiSuccess<unknown>>(
    `/community-posts/${postId}/comments/${commentId}`,
    { content },
  );
}

export function deleteCommunityComment(
  postId: string,
  commentId: string,
): Promise<ApiSuccess<unknown>> {
  return api.delete<ApiSuccess<unknown>>(
    `/community-posts/${postId}/comments/${commentId}`,
  );
}

// 상세 + 댓글 동시 조회. 없는 글이면 null.
export async function getCommunityPostDetail(postId: string): Promise<{
  post: CommunityPostDetailItem;
  comments: CommunityCommentItem[];
} | null> {
  try {
    const [postRes, commentsRes] = await Promise.all([
      api.get<ApiSuccess<CommunityPostDetailItem>>(
        `/community-posts/${postId}`,
      ),
      api.get<ApiSuccess<CommunityPaged<CommunityCommentItem>>>(
        `/community-posts/${postId}/comments`,
      ),
    ]);
    return { post: postRes.data, comments: commentsRes.data.items };
  } catch {
    return null;
  }
}
