// 커뮤니티 게시글 API 응답 타입 (백엔드 community-posts 응답과 1:1).
export type CommunityCategory =
  | 'QUESTION'
  | 'TIP'
  | 'REVIEW'
  | 'STUDY_GROUP'
  | 'FREE';

export interface CommunityPostListItem {
  id: string;
  userId: string;
  category: CommunityCategory;
  title: string;
  content: string;
  createdAt: string;
  authorDisplayName: string;
  likeCount: number;
  commentCount: number;
}

export interface CommunityPostDetailItem extends CommunityPostListItem {
  isLiked: boolean;
}

export interface CommunityCommentItem {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  authorDisplayName: string;
  authorProfileImageUrl: string | null;
}

export interface CommunityPagination {
  page: number;
  pageSize: number;
  totalCount: number;
  hasNext: boolean;
}

export interface CommunityPaged<T> {
  items: T[];
  pagination: CommunityPagination;
}
