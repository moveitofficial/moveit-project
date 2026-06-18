import type { ServiceListConfig } from '@/feature/serviceList/types';

export const PROJECT_REQUEST_LIST_CONFIG: ServiceListConfig = {
  serviceGroup: 'PROJECT_REQUEST',
  basePath: '/project-request',
  hero: {
    eyebrow: '전문가 연결',
    title: '프로젝트 의뢰',
    descriptionPrefix: '검증된 팀과 함께하는 프로젝트',
  },
  featured: {
    title: '프로젝트 의뢰 대표 서비스',
    description: '판매량·평점 기준 추천',
  },
  categoryOptions: [
    { id: 'ALL', label: '전체' },
    { id: 'WEB', label: '웹 제작' },
    { id: 'APP', label: '앱 제작' },
    { id: 'AI', label: 'AI 개발' },
    { id: 'GAME', label: '게임 개발' },
    { id: 'DATA_ANALYTICS', label: '데이터분석' },
  ],
  heroDescriptionVariant: 'regular',
};
