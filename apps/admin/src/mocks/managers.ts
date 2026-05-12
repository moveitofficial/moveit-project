import type { AdminManager, ApiSuccess, PaginatedResult } from './types';

export const mockAdminManagers: AdminManager[] = [
  {
    id: 'admin-001',
    email: 'super@moveit.kr',
    name: '슈퍼관리자',
    role: 'SUPER_ADMIN',
    lastLoginAt: '2026-05-12T09:00:00.000Z',
    createdAt: '2025-11-01T10:00:00.000Z',
  },
  {
    id: 'admin-002',
    email: 'admin1@moveit.kr',
    name: '김관리',
    role: 'ADMIN',
    lastLoginAt: '2026-05-11T18:00:00.000Z',
    createdAt: '2026-01-10T10:00:00.000Z',
  },
  {
    id: 'admin-003',
    email: 'admin2@moveit.kr',
    name: '이운영',
    role: 'ADMIN',
    lastLoginAt: null,
    createdAt: '2026-05-01T10:00:00.000Z',
  },
];

export const mockAdminManagersResponse: ApiSuccess<PaginatedResult<AdminManager>> = {
  success: true,
  message: '관리자 목록을 조회했습니다.',
  data: {
    items: mockAdminManagers,
    pagination: { page: 1, pageSize: 50, totalCount: 3, hasNext: false },
  },
};
