import type { ServiceListConfig } from '@/feature/serviceList/types';

export const IT_COACHING_LIST_CONFIG: ServiceListConfig = {
  serviceGroup: 'IT_COACHING',
  basePath: '/it-coaching',
  hero: {
    eyebrow: 'LEVEL UP',
    title: 'IT코칭',
    descriptionPrefix: '현업 시니어와 1:1 실무 코칭',
  },
  featured: {
    title: 'IT코칭 대표 서비스',
    description: '판매량·평점 기준 추천',
  },
  categoryOptions: [
    { id: 'ALL', label: '전체' },
    { id: 'WEB', label: '웹 개발' },
    { id: 'APP', label: '앱 개발' },
    { id: 'AI', label: 'AI' },
    { id: 'GAME', label: '게임 개발' },
    { id: 'DATA_ANALYTICS', label: '데이터분석' },
  ],
  heroDescriptionVariant: 'bold',
};
