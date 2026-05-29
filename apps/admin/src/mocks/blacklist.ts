import type { AdminBlacklistExpert, AdminBlacklistUser } from './types';

export const mockBlacklistedUsers: AdminBlacklistUser[] = [
  {
    id: 'bl-user-001',
    name: '박상민',
    email: 'park@example.com',
    provider: 'KAKAO',
    region: 'SEOUL',
    orderCount: 3,
    reportCount: 5,
    createdAt: '2025-11-10T10:00:00.000Z',
  },
  {
    id: 'bl-user-002',
    name: '최블랙',
    email: 'bad@example.com',
    provider: 'LOCAL',
    region: 'BUSAN',
    orderCount: 1,
    reportCount: 8,
    createdAt: '2025-09-05T09:00:00.000Z',
  },
  {
    id: 'bl-user-003',
    name: '강사기',
    email: 'fraud@example.com',
    provider: 'GOOGLE',
    region: 'DAEGU',
    orderCount: 0,
    reportCount: 3,
    createdAt: '2025-12-20T14:30:00.000Z',
  },
];

export const mockBlacklistedExperts: AdminBlacklistExpert[] = [
  {
    id: 'bl-expert-001',
    name: '이사기',
    email: 'scam@example.com',
    companyName: '가짜업체',
    serviceType: 'IT_COACHING',
    provider: 'LOCAL',
    region: 'SEOUL',
    totalOrders: 7,
    reportCount: 12,
    createdAt: '2025-08-15T11:00:00.000Z',
  },
  {
    id: 'bl-expert-002',
    name: '박불량',
    email: 'rogue@example.com',
    companyName: '불량스튜디오',
    serviceType: 'PROJECT_REQUEST',
    provider: 'GOOGLE',
    region: 'BUSAN',
    totalOrders: 4,
    reportCount: 6,
    createdAt: '2025-10-03T15:00:00.000Z',
  },
];
