import type { ApiSuccess } from './types';

export interface MetaServiceType {
  id: string;
  code: 'IT_COACHING' | 'PROJECT_REQUEST';
  name: string;
}

export interface MetaServiceCategory {
  id: string;
  serviceTypeId: string;
  code: string;
  name: string;
}

export interface MetaTechStack {
  id: string;
  name: string;
  type: 'FRONTEND' | 'BACKEND' | 'MOBILE' | 'DESIGN' | 'DATA' | 'ETC';
}

export const mockServiceTypes: MetaServiceType[] = [
  { id: 'st-001', code: 'IT_COACHING', name: 'IT 코칭' },
  { id: 'st-002', code: 'PROJECT_REQUEST', name: '프로젝트 의뢰' },
];

export const mockServiceCategories: MetaServiceCategory[] = [
  { id: 'sc-001', serviceTypeId: 'st-001', code: 'FRONTEND', name: '프론트엔드' },
  { id: 'sc-002', serviceTypeId: 'st-001', code: 'BACKEND', name: '백엔드' },
  { id: 'sc-003', serviceTypeId: 'st-001', code: 'MOBILE', name: '모바일' },
  { id: 'sc-004', serviceTypeId: 'st-001', code: 'DESIGN', name: '디자인' },
  { id: 'sc-005', serviceTypeId: 'st-002', code: 'WEB', name: '웹 개발' },
  { id: 'sc-006', serviceTypeId: 'st-002', code: 'APP', name: '앱 개발' },
  { id: 'sc-007', serviceTypeId: 'st-002', code: 'AI', name: 'AI / 머신러닝' },
  { id: 'sc-008', serviceTypeId: 'st-002', code: 'DATA', name: '데이터' },
];

export const mockTechStacks: MetaTechStack[] = [
  { id: 'ts-001', name: 'React', type: 'FRONTEND' },
  { id: 'ts-002', name: 'Next.js', type: 'FRONTEND' },
  { id: 'ts-003', name: 'TypeScript', type: 'FRONTEND' },
  { id: 'ts-004', name: 'Vue', type: 'FRONTEND' },
  { id: 'ts-005', name: 'Node.js', type: 'BACKEND' },
  { id: 'ts-006', name: 'NestJS', type: 'BACKEND' },
  { id: 'ts-007', name: 'Spring Boot', type: 'BACKEND' },
  { id: 'ts-008', name: 'Django', type: 'BACKEND' },
  { id: 'ts-009', name: 'React Native', type: 'MOBILE' },
  { id: 'ts-010', name: 'Flutter', type: 'MOBILE' },
  { id: 'ts-011', name: 'Swift', type: 'MOBILE' },
  { id: 'ts-012', name: 'Kotlin', type: 'MOBILE' },
  { id: 'ts-013', name: 'Figma', type: 'DESIGN' },
  { id: 'ts-014', name: 'Photoshop', type: 'DESIGN' },
  { id: 'ts-015', name: 'Python', type: 'DATA' },
  { id: 'ts-016', name: 'TensorFlow', type: 'DATA' },
];

export const mockServiceTypesResponse: ApiSuccess<MetaServiceType[]> = {
  success: true,
  message: '서비스 타입 목록을 조회했습니다.',
  data: mockServiceTypes,
};

export const mockServiceCategoriesResponse: ApiSuccess<MetaServiceCategory[]> = {
  success: true,
  message: '서비스 카테고리 목록을 조회했습니다.',
  data: mockServiceCategories,
};

export const mockTechStacksResponse: ApiSuccess<MetaTechStack[]> = {
  success: true,
  message: '기술스택 목록을 조회했습니다.',
  data: mockTechStacks,
};
