import type { CommunityCategory } from '@/mocks/types';

export type MyPostCategoryFilter = 'ALL' | CommunityCategory;

export type MyPostSort = 'latest' | 'likes' | 'comments';

export const MY_POST_PAGE_SIZE = 10;

export const MY_POST_CATEGORY_FILTERS: {
  id: MyPostCategoryFilter;
  label: string;
}[] = [
  { id: 'ALL', label: '전체' },
  { id: 'QUESTION', label: '질문' },
  { id: 'TIP', label: 'Tip·공유' },
  { id: 'REVIEW', label: '후기' },
  { id: 'STUDY_GROUP', label: '스터디 모임' },
  { id: 'FREE', label: '자유' },
];

export const MY_POST_SORT_OPTIONS: { id: MyPostSort; label: string }[] = [
  { id: 'latest', label: '최신순' },
  { id: 'likes', label: '좋아요순' },
  { id: 'comments', label: '댓글순' },
];
