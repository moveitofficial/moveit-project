import type { CommunityCategory } from '@/mocks/types';

export interface CommunityFilter {
  id: 'ALL' | CommunityCategory;
  label: string;
}

export const COMMUNITY_FILTERS: CommunityFilter[] = [
  { id: 'ALL', label: '전체주제' },
  { id: 'QUESTION', label: '질문' },
  { id: 'TIP', label: 'Tip·공유' },
  { id: 'REVIEW', label: '후기' },
  { id: 'STUDY_GROUP', label: '스터디 모임' },
  { id: 'FREE', label: '자유' },
];

export const COMMUNITY_PAGE_SIZE = 10;
