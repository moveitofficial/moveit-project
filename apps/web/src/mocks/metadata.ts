import type {
  ApiSuccess,
  ServiceCategoryMeta,
  ServiceGroupMeta,
  TechStackMeta,
  TechStackName,
} from './types';

export const mockServiceGroups: ServiceGroupMeta[] = [
  { id: 'sg-001', name: 'IT_COACHING', label: 'IT 코칭' },
  { id: 'sg-002', name: 'PROJECT_REQUEST', label: '프로젝트 의뢰' },
];

export const mockServiceCategories: ServiceCategoryMeta[] = [
  { id: 'sc-001', name: 'WEB', label: '웹' },
  { id: 'sc-002', name: 'APP', label: '앱' },
  { id: 'sc-003', name: 'AI', label: 'AI' },
  { id: 'sc-004', name: 'GAME', label: '게임' },
  { id: 'sc-005', name: 'DATA_ANALYTICS', label: '데이터 분석' },
];

export const mockTechStacks: TechStackMeta[] = [
  { id: 'ts-001', name: 'JAVASCRIPT', label: 'JavaScript' },
  { id: 'ts-002', name: 'TYPESCRIPT', label: 'TypeScript' },
  { id: 'ts-003', name: 'PYTHON', label: 'Python' },
  { id: 'ts-004', name: 'JAVA', label: 'Java' },
  { id: 'ts-005', name: 'KOTLIN', label: 'Kotlin' },
  { id: 'ts-006', name: 'SWIFT', label: 'Swift' },
  { id: 'ts-007', name: 'REACT', label: 'React' },
  { id: 'ts-008', name: 'NEXTJS', label: 'Next.js' },
  { id: 'ts-009', name: 'VUE', label: 'Vue' },
  { id: 'ts-010', name: 'REACT_NATIVE', label: 'React Native' },
  { id: 'ts-011', name: 'NODEJS', label: 'Node.js' },
  { id: 'ts-012', name: 'NESTJS', label: 'NestJS' },
  { id: 'ts-013', name: 'SPRING', label: 'Spring' },
  { id: 'ts-014', name: 'DJANGO', label: 'Django' },
  { id: 'ts-015', name: 'FASTAPI', label: 'FastAPI' },
  { id: 'ts-016', name: 'POSTGRESQL', label: 'PostgreSQL' },
  { id: 'ts-017', name: 'MYSQL', label: 'MySQL' },
  { id: 'ts-018', name: 'MONGODB', label: 'MongoDB' },
  { id: 'ts-019', name: 'AWS', label: 'AWS' },
  { id: 'ts-020', name: 'DOCKER', label: 'Docker' },
];

const techStackLabelMap = new Map<TechStackName, string>(
  mockTechStacks.map((t) => [t.name, t.label]),
);

/** TechStackName enum 값을 표시용 라벨로 변환 (예: REACT → React) */
export const getTechStackLabel = (name: TechStackName): string =>
  techStackLabelMap.get(name) ?? name;

export const mockServiceGroupsResponse: ApiSuccess<ServiceGroupMeta[]> = {
  success: true,
  message: '요청 성공',
  data: mockServiceGroups,
};

export const mockServiceCategoriesResponse: ApiSuccess<ServiceCategoryMeta[]> = {
  success: true,
  message: '요청 성공',
  data: mockServiceCategories,
};

export const mockTechStacksResponse: ApiSuccess<TechStackMeta[]> = {
  success: true,
  message: '요청 성공',
  data: mockTechStacks,
};
