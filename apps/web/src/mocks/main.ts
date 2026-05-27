import { mockExpertList } from './experts';
import { mockServiceList } from './services';

import type { ApiSuccess, MainData } from './types';

export const mockMainData: MainData = {
  banners: [
    {
      id: 'banner-001',
      imageUrl: 'https://picsum.photos/seed/banner1/1200/400',
      actionUrl: '/',
    },
    {
      id: 'banner-002',
      imageUrl: 'https://picsum.photos/seed/banner2/1200/400',
      actionUrl: '/',
    },
    {
      id: 'banner-003',
      imageUrl: 'https://picsum.photos/seed/banner3/1200/400',
      actionUrl: '/',
    },
  ],
  sections: [
    {
      sectionType: 'POPULAR_IT_COACHING',
      title: '가장 많이 찾는 IT 코칭',
      targetType: 'SERVICE',
      items: mockServiceList
        .filter((s) => s.categoryRef.group === 'IT_COACHING')
        .slice(0, 4),
    },
    {
      sectionType: 'POPULAR_PROJECT_REQUEST',
      title: '가장 많이 찾는 프로젝트 의뢰',
      targetType: 'SERVICE',
      items: mockServiceList
        .filter((s) => s.categoryRef.group === 'PROJECT_REQUEST')
        .slice(0, 4),
    },
    {
      sectionType: 'MOVEIT_POPULAR_COACHING',
      title: '무빗 인기 코칭',
      targetType: 'SERVICE',
      items: mockServiceList
        .filter((s) => s.categoryRef.group === 'IT_COACHING')
        .slice(0, 4),
    },
    {
      sectionType: 'MOVEIT_POPULAR_PROJECT_EXPERT',
      title: '무빗 인기 프로젝트 의뢰 전문가',
      targetType: 'USER',
      items: mockExpertList,
    },
    {
      sectionType: 'RECOMMENDED_IT_COACHING',
      title: '추천 IT 코칭',
      targetType: 'SERVICE',
      items: mockServiceList
        .filter((s) => s.categoryRef.group === 'IT_COACHING')
        .slice(0, 4),
    },
    {
      sectionType: 'RECOMMENDED_PROJECT_REQUEST',
      title: '추천 프로젝트 의뢰',
      targetType: 'SERVICE',
      items: mockServiceList
        .filter((s) => s.categoryRef.group === 'PROJECT_REQUEST')
        .slice(0, 4),
    },
  ],
  newServices: mockServiceList.slice(0, 4),
};

export const mockMainDataResponse: ApiSuccess<MainData> = {
  success: true,
  message: '요청 성공',
  data: mockMainData,
};
