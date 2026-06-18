export const SERVICE_GROUPS = [
  { id: 'IT_COACHING', label: 'IT 코칭' },
  { id: 'PROJECT_REQUEST', label: '프로젝트 의뢰' },
] as const;

export type ServiceGroupId = (typeof SERVICE_GROUPS)[number]['id'];
