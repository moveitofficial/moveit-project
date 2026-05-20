import type { AdminUser, ApiSuccess, PaginatedResult } from './types';

const adminUserOne: AdminUser = {
  id: 'user-001',
  email: 'kim@example.com',
  name: '김지훈',
  role: 'CLIENT',
  provider: 'LOCAL',
  region: 'SEOUL',
  phoneNumber: '010-1234-5678',
  profileImageUrl: 'https://i.pravatar.cc/150?img=12',
  isBlocked: false,
  blockReason: null,
  isDeleted: false,
  createdAt: '2026-01-15T10:00:00.000Z',
  lastLoginAt: '2026-05-12T08:30:00.000Z',
  orderCount: 2,
  reportCount: 0,
};

export const mockAdminUsers: AdminUser[] = [
  adminUserOne,
  {
    id: 'user-002',
    email: 'lee@example.com',
    name: '이수민',
    role: 'CLIENT',
    provider: 'GOOGLE',
    region: 'BUSAN',
    phoneNumber: '010-9876-5432',
    profileImageUrl: 'https://i.pravatar.cc/150?img=20',
    isBlocked: false,
    blockReason: null,
    isDeleted: false,
    createdAt: '2026-02-20T14:30:00.000Z',
    lastLoginAt: '2026-05-11T19:00:00.000Z',
    orderCount: 1,
    reportCount: 0,
  },
  {
    id: 'user-003',
    email: 'park@example.com',
    name: '박상민',
    role: 'CLIENT',
    provider: 'KAKAO',
    region: 'SEOUL',
    phoneNumber: '010-5555-1111',
    profileImageUrl: null,
    isBlocked: true,
    blockReason: '반복적인 욕설 및 신고 누적',
    isDeleted: false,
    createdAt: '2026-03-01T09:00:00.000Z',
    lastLoginAt: '2026-04-30T11:00:00.000Z',
    orderCount: 3,
    reportCount: 5,
  },
  {
    id: 'user-004',
    email: 'expert@example.com',
    name: '박전문',
    role: 'CLIENT',
    provider: 'LOCAL',
    region: 'SEOUL',
    phoneNumber: '010-2222-3333',
    profileImageUrl: 'https://i.pravatar.cc/150?img=33',
    isBlocked: false,
    blockReason: null,
    isDeleted: false,
    createdAt: '2025-12-01T10:00:00.000Z',
    lastLoginAt: '2026-05-12T09:00:00.000Z',
    orderCount: 0,
    reportCount: 0,
  },
];

export const mockAdminUsersResponse: ApiSuccess<PaginatedResult<AdminUser>> = {
  success: true,
  message: '유저 목록을 조회했습니다.',
  data: {
    items: mockAdminUsers,
    pagination: { page: 1, pageSize: 50, totalCount: 4, hasNext: false },
  },
};

export const mockAdminUserDetailResponse: ApiSuccess<{
  profile: AdminUser;
  purchaseHistories: { id: string; serviceTitle: string; amount: number; createdAt: string }[];
  receivedReports: { id: string; reason: string; createdAt: string }[];
  submittedReports: { id: string; targetName: string; reason: string; createdAt: string }[];
  posts: { id: string; title: string; createdAt: string }[];
  comments: { id: string; content: string; createdAt: string }[];
}> = {
  success: true,
  message: '유저 상세를 조회했습니다.',
  data: {
    profile: adminUserOne,
    purchaseHistories: [
      { id: 'order-001', serviceTitle: 'React Native 앱 개발', amount: 418_000, createdAt: '2026-04-25T10:00:00.000Z' },
      { id: 'order-002', serviceTitle: 'React 웹사이트 제작', amount: 275_000, createdAt: '2026-03-25T15:00:00.000Z' },
    ],
    receivedReports: [],
    submittedReports: [
      { id: 'rep-001', targetName: '나쁜 판매자', reason: 'ABUSE', createdAt: '2026-04-15T12:00:00.000Z' },
    ],
    posts: [
      { id: 'post-001', title: 'React 18 vs 19 어떤 게 더 좋을까요?', createdAt: '2026-05-10T14:20:00.000Z' },
    ],
    comments: [],
  },
};

export const mockWithdrawnUsersResponse: ApiSuccess<PaginatedResult<AdminUser>> = {
  success: true,
  message: '탈퇴 유저 목록을 조회했습니다.',
  data: {
    items: [
      {
        ...adminUserOne,
        id: 'user-deleted-001',
        name: '탈퇴1',
        isDeleted: true,
        lastLoginAt: '2026-03-15T10:00:00.000Z',
      },
    ],
    pagination: { page: 1, pageSize: 50, totalCount: 1, hasNext: false },
  },
};
