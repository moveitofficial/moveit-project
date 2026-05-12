import type { AdminBanner, AdminMainSetting, ApiSuccess } from './types';

export const mockAdminMainSettings: AdminMainSetting[] = [
  {
    id: 'set-001',
    sectionType: 'POPULAR_IT_COACHING',
    targetType: 'SERVICE',
    targetId: 'svc-001',
    targetTitle: '안드로이드 / iOS 앱 개발 React Native',
    thumbnailUrl: 'https://picsum.photos/seed/svc1/200/150',
    order: 1,
  },
  {
    id: 'set-002',
    sectionType: 'POPULAR_IT_COACHING',
    targetType: 'SERVICE',
    targetId: 'svc-002',
    targetTitle: 'React 기반 웹사이트 제작',
    thumbnailUrl: 'https://picsum.photos/seed/svc2/200/150',
    order: 2,
  },
  {
    id: 'set-003',
    sectionType: 'POPULAR_PROJECT_EXPERT',
    targetType: 'EXPERT',
    targetId: 'expert-001',
    targetTitle: '코드잇 에이전시',
    thumbnailUrl: 'https://i.pravatar.cc/200?img=33',
    order: 1,
  },
];

export const mockAdminBanners: AdminBanner[] = [
  {
    id: 'banner-001',
    imageUrl: 'https://picsum.photos/seed/banner1/1200/400',
    actionUrl: 'https://moveitofficial.com/services?category=IT_COACHING',
    order: 1,
    isActive: true,
    createdAt: '2026-04-01T10:00:00.000Z',
  },
  {
    id: 'banner-002',
    imageUrl: 'https://picsum.photos/seed/banner2/1200/400',
    actionUrl: 'https://moveitofficial.com/services?category=PROJECT_REQUEST',
    order: 2,
    isActive: true,
    createdAt: '2026-04-15T11:00:00.000Z',
  },
  {
    id: 'banner-003',
    imageUrl: 'https://picsum.photos/seed/banner3/1200/400',
    actionUrl: 'https://moveitofficial.com/experts',
    order: 3,
    isActive: false,
    createdAt: '2026-03-20T09:00:00.000Z',
  },
];

export const mockAdminMainSettingsResponse: ApiSuccess<AdminMainSetting[]> = {
  success: true,
  message: '메인 세팅을 조회했습니다.',
  data: mockAdminMainSettings,
};

export const mockAdminBannersResponse: ApiSuccess<AdminBanner[]> = {
  success: true,
  message: '배너 목록을 조회했습니다.',
  data: mockAdminBanners,
};
