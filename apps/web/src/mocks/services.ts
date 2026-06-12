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
  servicePrice: 380_000,
  workDuration: 30,
  revisionCount: 3,
  thumbnailUrl: 'https://picsum.photos/seed/svc1/400/300',
  status: 'ACTIVE',
  expert: {
    id: 'expert-001',
    name: '코드잇 에이전시',
    companyName: '코드잇 에이전시',
    profileImageUrl: 'https://i.pravatar.cc/150?img=33',
  },
  categoryRef: { group: 'PROJECT_REQUEST', category: 'APP' },
  rating: 4.9,
  reviewCount: 328,
  isFavorite: false,
};

const serviceTwo: ServiceListItem = {
  id: 'svc-002',
  title: 'React 기반 웹사이트 제작 (반응형)',
  servicePrice: 250_000,
  workDuration: 21,
  revisionCount: 2,
  thumbnailUrl: 'https://picsum.photos/seed/svc2/400/300',
  status: 'ACTIVE',
  expert: {
    id: 'expert-002',
    name: '웹스튜디오',
    companyName: '주식회사 웹스튜디오',
    profileImageUrl: 'https://i.pravatar.cc/150?img=44',
  },
  categoryRef: { group: 'PROJECT_REQUEST', category: 'WEB' },
  rating: 4.7,
  reviewCount: 154,
  isFavorite: true,
};

const serviceThree: ServiceListItem = {
  id: 'svc-003',
  title: 'NestJS + PostgreSQL 백엔드 API 1:1 코칭',
  servicePrice: 150_000,
  workDuration: 28,
  revisionCount: 3,
  thumbnailUrl: 'https://picsum.photos/seed/svc3/400/300',
  status: 'ACTIVE',
  expert: {
    id: 'expert-003',
    name: '백엔드 마스터',
    companyName: '백엔드 마스터',
    profileImageUrl: 'https://i.pravatar.cc/150?img=55',
  },
  categoryRef: { group: 'IT_COACHING', category: 'WEB' },
  rating: 5,
  reviewCount: 89,
  isFavorite: false,
};

const serviceFour: ServiceListItem = {
  id: 'svc-004',
  title: 'Figma 기반 UI/UX 디자인 코칭 패키지',
  servicePrice: 180_000,
  workDuration: 14,
  revisionCount: 5,
  thumbnailUrl: 'https://picsum.photos/seed/svc4/400/300',
  status: 'PAUSED',
  expert: {
    id: 'expert-004',
    name: '디자인 랩',
    companyName: '디자인 랩',
    profileImageUrl: 'https://i.pravatar.cc/150?img=22',
  },
  categoryRef: { group: 'IT_COACHING', category: 'APP' },
  rating: 4.8,
  reviewCount: 212,
  isFavorite: false,
};

const serviceFive: ServiceListItem = {
  id: 'svc-005',
  title: 'AI 챗봇 개발 (GPT API 기반)',
  servicePrice: 700_000,
  workDuration: 45,
  revisionCount: 2,
  thumbnailUrl: 'https://picsum.photos/seed/svc5/400/300',
  status: 'ACTIVE',
  expert: {
    id: 'expert-005',
    name: 'AI 스튜디오',
    companyName: 'AI 스튜디오',
    profileImageUrl: 'https://i.pravatar.cc/150?img=66',
  },
  categoryRef: { group: 'PROJECT_REQUEST', category: 'AI' },
  rating: 4.6,
  reviewCount: 45,
  isFavorite: true,
};

const serviceSix: ServiceListItem = {
  id: 'svc-006',
  title: 'Flutter 크로스플랫폼 앱 개발',
  servicePrice: 420_000,
  workDuration: 35,
  revisionCount: 3,
  thumbnailUrl: 'https://picsum.photos/seed/svc6/400/300',
  status: 'ACTIVE',
  expert: {
    id: 'expert-001',
    name: '코드잇 에이전시',
    companyName: '코드잇 에이전시',
    profileImageUrl: 'https://i.pravatar.cc/150?img=33',
  },
  categoryRef: { group: 'PROJECT_REQUEST', category: 'APP' },
  rating: 4.9,
  reviewCount: 178,
  isFavorite: false,
};

const serviceSeven: ServiceListItem = {
  id: 'svc-007',
  title: '쇼핑몰 웹사이트 제작 (Next.js)',
  servicePrice: 600_000,
  workDuration: 30,
  revisionCount: 3,
  thumbnailUrl: 'https://picsum.photos/seed/svc7/400/300',
  status: 'ACTIVE',
  expert: {
    id: 'expert-002',
    name: '웹스튜디오',
    companyName: '주식회사 웹스튜디오',
    profileImageUrl: 'https://i.pravatar.cc/150?img=44',
  },
  categoryRef: { group: 'PROJECT_REQUEST', category: 'WEB' },
  rating: 4.8,
  reviewCount: 96,
  isFavorite: false,
};

const serviceEight: ServiceListItem = {
  id: 'svc-008',
  title: '데이터 분석 대시보드 구축',
  servicePrice: 550_000,
  workDuration: 25,
  revisionCount: 2,
  thumbnailUrl: 'https://picsum.photos/seed/svc8/400/300',
  status: 'ACTIVE',
  expert: {
    id: 'expert-003',
    name: '백엔드 마스터',
    companyName: '백엔드 마스터',
    profileImageUrl: 'https://i.pravatar.cc/150?img=55',
  },
  categoryRef: { group: 'PROJECT_REQUEST', category: 'DATA_ANALYTICS' },
  rating: 4.7,
  reviewCount: 62,
  isFavorite: false,
};

const serviceNine: ServiceListItem = {
  id: 'svc-009',
  title: '모바일 게임 클라이언트 개발 (Unity)',
  servicePrice: 800_000,
  workDuration: 60,
  revisionCount: 2,
  thumbnailUrl: 'https://picsum.photos/seed/svc9/400/300',
  status: 'ACTIVE',
  expert: {
    id: 'expert-006',
    name: '게임 스튜디오',
    companyName: '게임 스튜디오',
    profileImageUrl: 'https://i.pravatar.cc/150?img=12',
  },
  categoryRef: { group: 'PROJECT_REQUEST', category: 'GAME' },
  rating: 4.5,
  reviewCount: 33,
  isFavorite: false,
};

const serviceTen: ServiceListItem = {
  id: 'svc-010',
  title: 'AI 모델 파인튜닝 & 운영 코칭',
  servicePrice: 200_000,
  workDuration: 21,
  revisionCount: 3,
  thumbnailUrl: 'https://picsum.photos/seed/svc10/400/300',
  status: 'ACTIVE',
  expert: {
    id: 'expert-005',
    name: 'AI 스튜디오',
    companyName: 'AI 스튜디오',
    profileImageUrl: 'https://i.pravatar.cc/150?img=66',
  },
  categoryRef: { group: 'IT_COACHING', category: 'AI' },
  rating: 4.7,
  reviewCount: 41,
  isFavorite: false,
};

const serviceEleven: ServiceListItem = {
  id: 'svc-011',
  title: '데이터 분석 1:1 멘토링 패키지',
  servicePrice: 220_000,
  workDuration: 28,
  revisionCount: 4,
  thumbnailUrl: 'https://picsum.photos/seed/svc11/400/300',
  status: 'ACTIVE',
  expert: {
    id: 'expert-003',
    name: '백엔드 마스터',
    companyName: '백엔드 마스터',
    profileImageUrl: 'https://i.pravatar.cc/150?img=55',
  },
  categoryRef: { group: 'IT_COACHING', category: 'DATA_ANALYTICS' },
  rating: 4.8,
  reviewCount: 58,
  isFavorite: false,
};

const serviceTwelve: ServiceListItem = {
  id: 'svc-012',
  title: '유니티 게임 개발 입문 코칭',
  servicePrice: 170_000,
  workDuration: 21,
  revisionCount: 5,
  thumbnailUrl: 'https://picsum.photos/seed/svc12/400/300',
  status: 'ACTIVE',
  expert: {
    id: 'expert-006',
    name: '게임 스튜디오',
    companyName: '게임 스튜디오',
    profileImageUrl: 'https://i.pravatar.cc/150?img=12',
  },
  categoryRef: { group: 'IT_COACHING', category: 'GAME' },
  rating: 4.6,
  reviewCount: 27,
  isFavorite: false,
};

export const mockServiceList: ServiceListItem[] = [
  serviceOne,
  serviceTwo,
  serviceThree,
  serviceFour,
  serviceFive,
  serviceSix,
  serviceSeven,
  serviceEight,
  serviceNine,
  serviceTen,
  serviceEleven,
  serviceTwelve,
];

export const mockServiceDetail: ServiceDetail = {
  id: 'svc-001',
  title: '안드로이드 / iOS 앱 개발 React Native',
  workDuration: 30,
  revisionCount: 3,
  serviceScope: '기획, 디자인, 개발',
  servicePrice: 380_000,
  description: `- 앱 출시를 앞두고 개발 파트너가 필요한 스타트업
- 기획은 있지만 실제 구현이 막막한 분
- React Native로 iOS·Android를 동시에 만들고 싶은 분

React Native 기반으로 iOS / Android 앱을 동시에 개발해드립니다.
기획 단계부터 함께 논의하며, 디자인과 개발을 모두 진행합니다.
유지보수 가능한 클린 아키텍처로 작성합니다.`,
  preparationNotes:
    '의뢰 시 원하는 기능 명세서(또는 레퍼런스 앱 링크)를 함께 보내주시면 견적이 정확해집니다.',
  refundPolicy: '작업 시작 전: 100% 환불 / 작업 진행 중: 진행률 차감 후 환불',
  status: 'ACTIVE',
  categoryRef: { group: 'PROJECT_REQUEST', category: 'APP' },
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
  techStacks: ['REACT_NATIVE', 'TYPESCRIPT'],
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
    totalCount: 35,
    averageRating: 4.2,
  },
  recommendedServices: mockServiceList.slice(1, 4),
};

export const mockServiceListResponse: ApiSuccess<PaginatedResult<ServiceListItem>> = {
  success: true,
  message: '요청 성공',
  data: {
    items: mockServiceList,
    pagination: { page: 1, pageSize: 20, totalCount: 120, hasNext: true },
  },
};

export const mockServiceDetailResponse: ApiSuccess<ServiceDetail> = {
  success: true,
  message: '요청 성공',
  data: mockServiceDetail,
};
