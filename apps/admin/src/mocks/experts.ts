import type { AdminExpert, ApiSuccess, PaginatedResult } from './types';

const adminExpertOne: AdminExpert = {
  id: 'expert-001',
  userId: 'user-101',
  email: 'codeit@example.com',
  name: '박전문가',
  role: 'EXPERT',
  companyName: '코드잇 에이전시',
  companyNumber: '123-45-67890',
  bossName: '김대표',
  region: 'SEOUL',
  phoneNumber: '010-1111-2222',
  provider: 'LOCAL',
  serviceType: 'IT_COACHING',
  approvalStatus: 'APPROVED',
  rejectReason: null,
  techStacks: ['React', 'TypeScript', 'NestJS'],
  totalRevenue: 12_000_000,
  totalOrders: 35,
  rating: 4.9,
  reportCount: 0,
  createdAt: '2025-12-01T10:00:00.000Z',
};

export const mockAdminExperts: AdminExpert[] = [
  adminExpertOne,
  {
    id: 'expert-002',
    userId: 'user-102',
    email: 'webstudio@example.com',
    name: '이디자이너',
    role: 'EXPERT',
    companyName: '주식회사 웹스튜디오',
    companyNumber: '234-56-78901',
    bossName: '이대표',
    region: 'BUSAN',
    phoneNumber: '010-3333-4444',
    provider: 'GOOGLE',
    serviceType: 'PROJECT_REQUEST',
    approvalStatus: 'APPROVED',
    rejectReason: null,
    techStacks: ['React', 'Vue', 'Tailwind'],
    totalRevenue: 5_400_000,
    totalOrders: 22,
    rating: 4.7,
    reportCount: 0,
    createdAt: '2026-01-10T11:00:00.000Z',
  },
  {
    id: 'expert-003',
    userId: 'user-103',
    email: 'newbie@example.com',
    name: '김신입',
    role: 'EXPERT',
    companyName: '뉴비스튜디오',
    companyNumber: '345-67-89012',
    bossName: '김대표',
    region: 'SEOUL',
    phoneNumber: '010-5555-6666',
    provider: 'KAKAO',
    serviceType: 'IT_COACHING',
    approvalStatus: 'PENDING',
    rejectReason: null,
    techStacks: ['React', 'Next.js'],
    totalRevenue: 0,
    totalOrders: 0,
    rating: 0,
    reportCount: 0,
    createdAt: '2026-05-10T15:00:00.000Z',
  },
  {
    id: 'expert-004',
    userId: 'user-104',
    email: 'rejected@example.com',
    name: '이거절',
    role: 'EXPERT',
    companyName: '거절업체',
    companyNumber: '999-99-99999',
    bossName: '이대표',
    region: 'SEOUL',
    phoneNumber: '010-7777-8888',
    provider: 'LOCAL',
    serviceType: 'PROJECT_REQUEST',
    approvalStatus: 'REJECTED',
    rejectReason: '사업자 정보가 확인되지 않습니다.',
    techStacks: [],
    totalRevenue: 0,
    totalOrders: 0,
    rating: 0,
    reportCount: 1,
    createdAt: '2026-04-20T09:00:00.000Z',
  },
];

export const mockAdminExpertsResponse: ApiSuccess<
  PaginatedResult<AdminExpert>
> = {
  success: true,
  message: '판매자 목록을 조회했습니다.',
  data: {
    items: mockAdminExperts,
    pagination: { page: 1, pageSize: 50, totalCount: 4, hasNext: false },
  },
};

export const mockAdminExpertDetailResponse: ApiSuccess<AdminExpert> = {
  success: true,
  message: '판매자 상세를 조회했습니다.',
  data: adminExpertOne,
};

export const mockAdminPendingExpertsResponse: ApiSuccess<
  PaginatedResult<AdminExpert>
> = {
  success: true,
  message: '승인 대기 판매자 목록을 조회했습니다.',
  data: {
    items: mockAdminExperts.filter((e) => e.approvalStatus === 'PENDING'),
    pagination: { page: 1, pageSize: 50, totalCount: 1, hasNext: false },
  },
};
