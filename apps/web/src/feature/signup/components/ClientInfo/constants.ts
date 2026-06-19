export const INTEREST_AREAS = [
  { id: 'IT_COACHING', label: 'IT 코칭' },
  { id: 'PROJECT_REQUEST', label: '프로젝트 의뢰' },
] as const;

export type InterestAreaId = (typeof INTEREST_AREAS)[number]['id'];

interface DetailAreaOption {
  id: string;
  label: string;
}

export const DETAIL_AREAS_BY_INTEREST: Record<
  InterestAreaId,
  readonly DetailAreaOption[]
> = {
  IT_COACHING: [
    { id: 'WEB', label: '웹 제작' },
    { id: 'APP', label: '앱 제작' },
    { id: 'AI', label: 'AI 개발' },
    { id: 'GAME', label: '게임 개발' },
    { id: 'DATA_ANALYTICS', label: '데이터분석/자동화' },
  ],
  PROJECT_REQUEST: [
    { id: 'WEB', label: '웹 제작' },
    { id: 'APP', label: '앱 제작' },
    { id: 'AI', label: 'AI 개발' },
    { id: 'GAME', label: '게임 개발' },
    { id: 'DATA_ANALYTICS', label: '데이터분석/자동화' },
  ],
};

export const MAX_DETAIL_AREAS = 3;
