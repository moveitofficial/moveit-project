import type { ServiceGroupId } from './serviceGroups';

export type ServiceCategoryId =
  | 'WEB'
  | 'APP'
  | 'AI'
  | 'GAME'
  | 'DATA_ANALYTICS';

interface ServiceCategoryOption {
  id: ServiceCategoryId;
  label: string;
}

export const SERVICE_CATEGORIES_BY_GROUP: Record<
  ServiceGroupId,
  readonly ServiceCategoryOption[]
> = {
  IT_COACHING: [
    { id: 'WEB', label: '웹 개발' },
    { id: 'APP', label: '앱 개발' },
    { id: 'AI', label: 'AI' },
    { id: 'GAME', label: '게임 개발' },
    { id: 'DATA_ANALYTICS', label: '데이터분석' },
  ],
  PROJECT_REQUEST: [
    { id: 'WEB', label: '웹 제작' },
    { id: 'APP', label: '앱 제작' },
    { id: 'AI', label: 'AI 개발' },
    { id: 'GAME', label: '게임 개발' },
    { id: 'DATA_ANALYTICS', label: '데이터분석' },
  ],
};
