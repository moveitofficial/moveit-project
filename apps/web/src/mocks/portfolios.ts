import type {
  ApiSuccess,
  PaginatedResult,
  PortfolioDetail,
  PortfolioListItem,
} from './types';

const portfolioOne: PortfolioListItem = {
  id: 'port-001',
  title: 'The CNM 교육 플랫폼',
  thumbnailUrl: 'https://picsum.photos/seed/port1/400/300',
  clientName: 'CNM',
  businessSector: 'PUBLIC_INSTITUTION',
};

export const mockPortfolios: PortfolioListItem[] = [
  portfolioOne,
  {
    id: 'port-002',
    title: '핀테크 모바일 앱',
    thumbnailUrl: 'https://picsum.photos/seed/port2/400/300',
    clientName: 'FinTechCo',
    businessSector: 'LEGAL_TAX',
  },
  {
    id: 'port-003',
    title: '커머스 어드민 대시보드',
    thumbnailUrl: 'https://picsum.photos/seed/port3/400/300',
    clientName: 'CommerceX',
    businessSector: 'ECOMMERCE',
  },
  {
    id: 'port-004',
    title: '헬스케어 환자 관리 시스템',
    thumbnailUrl: 'https://picsum.photos/seed/port4/400/300',
    clientName: 'HealthCare+',
    businessSector: 'MEDICAL_PHARMA',
  },
  {
    id: 'port-005',
    title: '아파트 분양 관리 플랫폼',
    thumbnailUrl: 'https://picsum.photos/seed/port5/400/300',
    clientName: 'PropertyHub',
    businessSector: 'REAL_ESTATE',
  },
];

export const mockPortfolioDetail: PortfolioDetail = {
  ...portfolioOne,
  description: `CNM 교육 플랫폼 리뉴얼 프로젝트.

  Next.js + NestJS 풀스택으로 개발했습니다.
  실시간 강의실, 결제, 학생 관리 기능 포함.`,
  skills: [
    { stackName: 'REACT', stackType: 'FRONTEND' },
    { stackName: 'NEXTJS', stackType: 'FRONTEND' },
    { stackName: 'NESTJS', stackType: 'BACKEND' },
    { stackName: 'POSTGRESQL', stackType: 'BACKEND' },
  ],
  images: [
    { id: 'pimg-001', url: 'https://picsum.photos/seed/portimg1/800/600', isMain: true },
    { id: 'pimg-002', url: 'https://picsum.photos/seed/portimg2/800/600', isMain: false },
    { id: 'pimg-003', url: 'https://picsum.photos/seed/portimg3/800/600', isMain: false },
  ],
};

export const mockPortfolioListResponse: ApiSuccess<PaginatedResult<PortfolioListItem>> = {
  success: true,
  message: '요청 성공',
  data: {
    items: mockPortfolios,
    pagination: { page: 1, pageSize: 20, totalCount: 5, hasNext: false },
  },
};

export const mockPortfolioDetailResponse: ApiSuccess<PortfolioDetail> = {
  success: true,
  message: '요청 성공',
  data: mockPortfolioDetail,
};
