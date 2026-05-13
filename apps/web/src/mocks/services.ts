import { mockReviews } from './reviews';

import type {
  ApiSuccess,
  PaginatedResult,
  ServiceDetail,
  ServiceListItem,
} from './types';

export const serviceOne: ServiceListItem = {
  id: 'svc-001',
  title: '안드로이드 / iOS 앱 개발 React Native',
  price: 380_000,
  duration: 30,
  revisionCount: 3,
  thumbnailUrl: 'https://picsum.photos/seed/svc1/400/300',
  expert: {
    id: 'expert-001',
    name: '코드잇 에이전시',
    companyName: '코드잇 에이전시',
  },
  category: { type: 'IT_COACHING', detail: 'APP' },
  rating: 4.9,
  reviewCount: 328,
  isFavorite: false,
};

const serviceTwo: ServiceListItem = {
  id: 'svc-002',
  title: 'React 기반 웹사이트 제작 (반응형)',
  price: 250_000,
  duration: 21,
  revisionCount: 2,
  thumbnailUrl: 'https://picsum.photos/seed/svc2/400/300',
  expert: {
    id: 'expert-002',
    name: '웹스튜디오',
    companyName: '주식회사 웹스튜디오',
  },
  category: { type: 'IT_COACHING', detail: 'FRONTEND' },
  rating: 4.7,
  reviewCount: 154,
  isFavorite: true,
};

const serviceThree: ServiceListItem = {
  id: 'svc-003',
  title: 'NestJS + PostgreSQL 백엔드 API 구축',
  price: 500_000,
  duration: 40,
  revisionCount: 3,
  thumbnailUrl: 'https://picsum.photos/seed/svc3/400/300',
  expert: {
    id: 'expert-003',
    name: '백엔드 마스터',
    companyName: '백엔드 마스터',
  },
  category: { type: 'IT_COACHING', detail: 'BACKEND' },
  rating: 5,
  reviewCount: 89,
  isFavorite: false,
};

const serviceFour: ServiceListItem = {
  id: 'svc-004',
  title: 'Figma 기반 UI/UX 디자인 패키지',
  price: 180_000,
  duration: 14,
  revisionCount: 5,
  thumbnailUrl: 'https://picsum.photos/seed/svc4/400/300',
  expert: {
    id: 'expert-004',
    name: '디자인 랩',
    companyName: '디자인 랩',
  },
  category: { type: 'IT_COACHING', detail: 'DESIGN' },
  rating: 4.8,
  reviewCount: 212,
  isFavorite: false,
};

const serviceFive: ServiceListItem = {
  id: 'svc-005',
  title: 'AI 챗봇 개발 (GPT API 기반)',
  price: 700_000,
  duration: 45,
  revisionCount: 2,
  thumbnailUrl: 'https://picsum.photos/seed/svc5/400/300',
  expert: {
    id: 'expert-005',
    name: 'AI 스튜디오',
    companyName: 'AI 스튜디오',
  },
  category: { type: 'PROJECT_REQUEST', detail: 'AI' },
  rating: 4.6,
  reviewCount: 45,
  isFavorite: true,
};

const serviceSix: ServiceListItem = {
  id: 'svc-006',
  title: 'Flutter 크로스플랫폼 앱 개발',
  price: 420_000,
  duration: 35,
  revisionCount: 3,
  thumbnailUrl: 'https://picsum.photos/seed/svc6/400/300',
  expert: {
    id: 'expert-001',
    name: '코드잇 에이전시',
    companyName: '코드잇 에이전시',
  },
  category: { type: 'PROJECT_REQUEST', detail: 'APP' },
  rating: 4.9,
  reviewCount: 178,
  isFavorite: false,
};

export const mockServiceList: ServiceListItem[] = [
  serviceOne,
  serviceTwo,
  serviceThree,
  serviceFour,
  serviceFive,
  serviceSix,
];

export const mockServiceDetail: ServiceDetail = {
  id: 'svc-001',
  title: '프론트 앱개발 씬스있는 디자인+개발 합니다.',
  duration: 30,
  revisionCount: 3,
  scope: '기획, 디자인, 개발',
  servicePrice: 120_000,
  description: `React Native 기반으로 iOS / Android 앱을 동시에 개발해드립니다.

  기획 단계부터 함께 논의하며, 디자인과 개발을 모두 진행합니다.
  유지보수 가능한 클린 아키텍처로 작성합니다.`,
  refundPolicy: '작업 시작 전: 100% 환불 / 작업 진행 중: 진행률 차감 후 환불',
  status: 'ON_SALE',
  isFavorite: false,
  expert: {
    id: 'expert-001',
    name: '코드잇 에이전시',
    companyName: '코드잇 에이전시',
    profileImageUrl: 'https://i.pravatar.cc/150?img=33',
  },
  images: [
    { id: 'img-001', url: 'https://picsum.photos/seed/svcdetail1/800/600', isMain: true },
    { id: 'img-002', url: 'https://picsum.photos/seed/svcdetail2/800/600', isMain: false },
    { id: 'img-003', url: 'https://picsum.photos/seed/svcdetail3/800/600', isMain: false },
  ],
  techStacks: ['React Native', 'TypeScript', 'Expo', 'Firebase'],
  steps: [
    { order: 1, title: '요구사항 분석', description: '클라이언트의 요구사항을 명확히 정리합니다.' },
    { order: 2, title: '디자인 시안 작성', description: 'Figma로 디자인 시안을 만들어 검토받습니다.' },
    { order: 3, title: '개발 진행', description: '단계별 스프린트로 개발하며 중간 점검을 합니다.' },
    { order: 4, title: '테스트 & 배포', description: '내부 테스트 후 스토어 배포까지 도와드립니다.' },
  ],
  faqs: [
    { id: 'faq-001', question: '개발 기간은 얼마나 걸리나요?', answer: '보통 2~4주 정도 소요됩니다.' },
    { id: 'faq-002', question: '수정은 몇 번 가능한가요?', answer: '계약 범위 내 3회까지 무료로 진행됩니다.' },
    { id: 'faq-003', question: '소스 코드를 받을 수 있나요?', answer: '네, 작업 완료 후 전체 소스 코드를 전달드립니다.' },
  ],
  reviews: {
    items: mockReviews,
    totalCount: 328,
    averageRating: 4.9,
  },
  recommendedServices: mockServiceList.slice(1, 4),
};

export const mockServiceListResponse: ApiSuccess<PaginatedResult<ServiceListItem>> = {
  success: true,
  message: '서비스 목록을 조회했습니다.',
  data: {
    items: mockServiceList,
    pagination: { page: 1, pageSize: 20, totalCount: 120, hasNext: true },
  },
};

export const mockServiceDetailResponse: ApiSuccess<ServiceDetail> = {
  success: true,
  message: '서비스 상세를 조회했습니다.',
  data: mockServiceDetail,
};
