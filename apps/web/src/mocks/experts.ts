import { mockPortfolios } from './portfolios';
import { mockServiceList } from './services';

import type {
  ApiSuccess,
  ExpertDetail,
  PaginatedResult,
} from './types';

const expertOne: ExpertDetail = {
  id: 'expert-001',
  name: '코드잇 에이전시',
  companyName: '코드잇 에이전시',
  description: '웹/앱/AI까지 풀스택 개발 가능한 전문가 팀입니다.',
  profileImageUrl: 'https://i.pravatar.cc/300?img=33',
  isFavorite: false,
  stats: {
    totalReviews: 328,
    averageRating: 4.9,
    purchaseRate: 80,
    completionRate: 100,
  },
  specialtyCategories: [
    { group: 'PROJECT_REQUEST', category: 'APP' },
    { group: 'PROJECT_REQUEST', category: 'WEB' },
  ],
  techStacks: ['REACT', 'TYPESCRIPT', 'NEXTJS', 'REACT_NATIVE', 'NESTJS'],
  portfolios: mockPortfolios.slice(0, 3),
  services: mockServiceList.filter((s) => s.expert.id === 'expert-001'),
};

const expertTwo: ExpertDetail = {
  id: 'expert-002',
  name: '웹스튜디오',
  companyName: '주식회사 웹스튜디오',
  description: '반응형 웹사이트 전문 스튜디오. 5년차 베테랑.',
  profileImageUrl: 'https://i.pravatar.cc/300?img=44',
  isFavorite: true,
  stats: {
    totalReviews: 154,
    averageRating: 4.7,
    purchaseRate: 72,
    completionRate: 98,
  },
  specialtyCategories: [{ group: 'PROJECT_REQUEST', category: 'WEB' }],
  techStacks: ['REACT', 'VUE', 'TYPESCRIPT', 'NEXTJS'],
  portfolios: mockPortfolios.slice(2, 4),
  services: mockServiceList.filter((s) => s.expert.id === 'expert-002'),
};

const expertThree: ExpertDetail = {
  id: 'expert-003',
  name: '백엔드 마스터',
  companyName: '백엔드 마스터',
  description: 'Node.js, NestJS, PostgreSQL 전문. 대기업 프로젝트 다수.',
  profileImageUrl: 'https://i.pravatar.cc/300?img=55',
  isFavorite: false,
  stats: {
    totalReviews: 89,
    averageRating: 5,
    purchaseRate: 95,
    completionRate: 100,
  },
  specialtyCategories: [
    { group: 'IT_COACHING', category: 'WEB' },
    { group: 'PROJECT_REQUEST', category: 'DATA_ANALYTICS' },
  ],
  techStacks: ['NODEJS', 'NESTJS', 'POSTGRESQL', 'DOCKER', 'AWS'],
  portfolios: mockPortfolios.slice(1, 3),
  services: mockServiceList.filter((s) => s.expert.id === 'expert-003'),
};

export const mockExpertList: ExpertDetail[] = [expertOne, expertTwo, expertThree];

export const mockExpertListResponse: ApiSuccess<PaginatedResult<ExpertDetail>> = {
  success: true,
  message: '요청 성공',
  data: {
    items: mockExpertList,
    pagination: { page: 1, pageSize: 20, totalCount: 45, hasNext: true },
  },
};

export const mockExpertDetailResponse: ApiSuccess<ExpertDetail> = {
  success: true,
  message: '요청 성공',
  data: expertOne,
};
