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
  ceoName: '김코드',
  description:
    '네이버·토스 등 대기업 출신 CTO, 스타트업 CTO 경험을 보유한 10년차 React/Next.js 전문가입니다. 코드리뷰·아키텍처 설계·실무 코칭까지 지원합니다.',
  profileImageUrl: 'https://i.pravatar.cc/300?img=33',
  isFavorite: false,
  favoriteCount: 330,
  stats: {
    totalReviews: 350,
    averageRating: 4.9,
    purchaseRate: 80,
    completionRate: 100,
  },
  totalOrderCount: 328,
  serviceCount: 8,
  clientNames: ['코드잇', '네이버', '토스', '당근', '배민'],
  foundedYear: 2021,
  region: 'SEOUL',
  employeeMin: 5,
  employeeMax: 10,
  contactTimeStart: '09:00',
  contactTimeEnd: '18:00',
  specialtyCategories: [
    { group: 'PROJECT_REQUEST', category: 'APP' },
    { group: 'PROJECT_REQUEST', category: 'WEB' },
  ],
  techStacks: ['REACT', 'TYPESCRIPT', 'NEXTJS'],
  portfolios: mockPortfolios.slice(0, 4),
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

const expertFour: ExpertDetail = {
  id: 'expert-004',
  name: '디자인 랩',
  companyName: '디자인 랩',
  description: 'UI/UX 디자인 · 9년차',
  profileImageUrl: 'https://i.pravatar.cc/300?img=22',
  isFavorite: false,
  stats: {
    totalReviews: 212,
    averageRating: 4.8,
    purchaseRate: 76,
    completionRate: 99,
  },
  specialtyCategories: [{ group: 'IT_COACHING', category: 'APP' }],
  techStacks: ['REACT', 'TYPESCRIPT', 'VUE'],
  portfolios: mockPortfolios.slice(0, 2),
  services: mockServiceList.filter((s) => s.expert.id === 'expert-004'),
};

const expertFive: ExpertDetail = {
  id: 'expert-005',
  name: 'AI 스튜디오',
  companyName: 'AI 스튜디오',
  description: 'AI 엔지니어 · 9년차',
  profileImageUrl: null,
  isFavorite: false,
  stats: {
    totalReviews: 124,
    averageRating: 4.9,
    purchaseRate: 88,
    completionRate: 100,
  },
  specialtyCategories: [{ group: 'PROJECT_REQUEST', category: 'AI' }],
  techStacks: ['PYTHON', 'FASTAPI', 'DOCKER'],
  portfolios: mockPortfolios.slice(1, 3),
  services: mockServiceList.filter((s) => s.expert.id === 'expert-005'),
};

const expertSix: ExpertDetail = {
  id: 'expert-006',
  name: '게임 스튜디오',
  companyName: '게임 스튜디오',
  description: '게임 클라이언트 개발 · 9년차',
  profileImageUrl: null,
  isFavorite: false,
  stats: {
    totalReviews: 60,
    averageRating: 4.5,
    purchaseRate: 70,
    completionRate: 96,
  },
  specialtyCategories: [{ group: 'PROJECT_REQUEST', category: 'GAME' }],
  techStacks: ['JAVASCRIPT', 'KOTLIN', 'SWIFT'],
  portfolios: mockPortfolios.slice(2, 4),
  services: mockServiceList.filter((s) => s.expert.id === 'expert-006'),
};

const expertSeven: ExpertDetail = {
  id: 'expert-007',
  name: '데브멘토',
  companyName: '데브멘토',
  description: '웹사이트 강의 · 9년차',
  profileImageUrl: null,
  isFavorite: false,
  stats: {
    totalReviews: 124,
    averageRating: 4.9,
    purchaseRate: 82,
    completionRate: 98,
  },
  specialtyCategories: [{ group: 'IT_COACHING', category: 'WEB' }],
  techStacks: ['REACT', 'NEXTJS', 'TYPESCRIPT'],
  portfolios: mockPortfolios.slice(0, 3),
  services: mockServiceList.filter((s) => s.expert.id === 'expert-007'),
};

const expertEight: ExpertDetail = {
  id: 'expert-008',
  name: '스타트업랩',
  companyName: '스타트업랩',
  ceoName: '이신규',
  description: '스타트업 MVP 개발 전문. 플랫폼 입점 직후 활동 중인 신규 전문가입니다.',
  profileImageUrl: 'https://i.pravatar.cc/300?img=12',
  isFavorite: false,
  favoriteCount: 0,
  stats: {
    totalReviews: 0,
    averageRating: null,
    purchaseRate: null,
    completionRate: null,
  },
  totalOrderCount: 0,
  serviceCount: 0,
  clientNames: ['스타트업A'],
  foundedYear: 2025,
  region: 'SEOUL',
  employeeMin: 1,
  employeeMax: 5,
  contactTimeStart: '09:00',
  contactTimeEnd: '18:00',
  specialtyCategories: [{ group: 'PROJECT_REQUEST', category: 'WEB' }],
  techStacks: ['REACT', 'TYPESCRIPT', 'NEXTJS'],
  portfolios: mockPortfolios.slice(0, 1),
  services: [],
};

export const mockExpertList: ExpertDetail[] = [
  expertOne,
  expertTwo,
  expertThree,
  expertFour,
  expertFive,
  expertSix,
  expertSeven,
  expertEight,
];

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
