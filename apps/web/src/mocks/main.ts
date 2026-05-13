import { mockExpertList } from './experts';
import { mockServiceList } from './services';

import type { ApiSuccess, MainData } from './types';

export const mockMainData: MainData = {
  banners: [
    {
      id: 'banner-001',
      imageUrl: 'https://picsum.photos/seed/banner1/1200/400',
      actionUrl: '/services?category=IT_COACHING',
    },
    {
      id: 'banner-002',
      imageUrl: 'https://picsum.photos/seed/banner2/1200/400',
      actionUrl: '/services?category=PROJECT_REQUEST',
    },
    {
      id: 'banner-003',
      imageUrl: 'https://picsum.photos/seed/banner3/1200/400',
      actionUrl: '/experts',
    },
  ],
  sections: [
    {
      sectionType: 'POPULAR_IT_COACHING',
      title: '가장 많이 찾는 IT 코칭',
      targetType: 'SERVICE',
      items: mockServiceList.filter((s) => s.category.type === 'IT_COACHING').slice(0, 4),
    },
    {
      sectionType: 'POPULAR_PROJECT_EXPERT',
      title: 'moveit 인기 프로젝트 의뢰 전문가',
      targetType: 'EXPERT',
      items: mockExpertList.slice(0, 3),
    },
    {
      sectionType: 'NEW_SERVICES',
      title: '새로 등록된 서비스',
      targetType: 'SERVICE',
      items: mockServiceList.slice(0, 4),
    },
  ],
};

export const mockMainDataResponse: ApiSuccess<MainData> = {
  success: true,
  message: '메인 데이터를 조회했습니다.',
  data: mockMainData,
};
