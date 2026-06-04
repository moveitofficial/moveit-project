import type { Region, ServiceCategoryName, TechStackName } from '@/mocks/types';

export type ItCoachingCategoryFilter = 'ALL' | ServiceCategoryName;

export type ItCoachingSort =
  | 'RECOMMENDED'
  | 'SALES'
  | 'LATEST'
  | 'RATING'
  | 'PRICE_ASC';

export interface ItCoachingCategoryOption {
  id: ItCoachingCategoryFilter;
  label: string;
}

export interface ItCoachingSortOption {
  id: ItCoachingSort;
  label: string;
}

export interface ItCoachingPriceFilter {
  id: string;
  label: string;
  min: number | null;
  max: number | null;
}

export interface ItCoachingTechStackFilter {
  id: TechStackName;
  label: string;
}

export interface ItCoachingRegionFilter {
  id: Region;
  label: string;
}

export const IT_COACHING_PAGE_SIZE = 12;

export const IT_COACHING_FEATURED_COUNT = 4;

export const IT_COACHING_CATEGORY_OPTIONS: ItCoachingCategoryOption[] = [
  { id: 'ALL', label: '전체' },
  { id: 'WEB', label: '웹 개발' },
  { id: 'APP', label: '앱 개발' },
  { id: 'AI', label: 'AI' },
  { id: 'GAME', label: '게임 개발' },
  { id: 'DATA_ANALYTICS', label: '데이터분석' },
];

export const IT_COACHING_SORT_OPTIONS: ItCoachingSortOption[] = [
  { id: 'RECOMMENDED', label: '추천순' },
  { id: 'SALES', label: '판매순' },
  { id: 'LATEST', label: '최신순' },
  { id: 'RATING', label: '평점순' },
  { id: 'PRICE_ASC', label: '가격 낮은순' },
];

export const IT_COACHING_PRICE_FILTERS: ItCoachingPriceFilter[] = [
  { id: 'UNDER_50K', label: '~ 5만원', min: null, max: 50_000 },
  {
    id: '50K_150K',
    label: '5 ~ 15만원',
    min: 50_000,
    max: 150_000,
  },
  {
    id: '150K_500K',
    label: '15 ~ 50만원',
    min: 150_000,
    max: 500_000,
  },
  { id: 'OVER_500K', label: '50만원 이상', min: 500_000, max: null },
];

export const IT_COACHING_TECH_STACK_FILTERS: ItCoachingTechStackFilter[] = [
  { id: 'JAVASCRIPT', label: 'JavaScript' },
  { id: 'TYPESCRIPT', label: 'TypeScript' },
  { id: 'PYTHON', label: 'Python' },
  { id: 'JAVA', label: 'Java' },
  { id: 'KOTLIN', label: 'Kotlin' },
  { id: 'SWIFT', label: 'Swift' },
  { id: 'REACT', label: 'React' },
  { id: 'NEXTJS', label: 'Next.js' },
  { id: 'VUE', label: 'Vue' },
  { id: 'REACT_NATIVE', label: 'React Native' },
  { id: 'NODEJS', label: 'Node.js' },
  { id: 'NESTJS', label: 'NestJS' },
  { id: 'SPRING', label: 'Spring' },
  { id: 'DJANGO', label: 'Django' },
  { id: 'FASTAPI', label: 'FastAPI' },
  { id: 'POSTGRESQL', label: 'PostgreSQL' },
  { id: 'MYSQL', label: 'MySQL' },
  { id: 'MONGODB', label: 'MongoDB' },
  { id: 'AWS', label: 'AWS' },
  { id: 'DOCKER', label: 'Docker' },
];

export const IT_COACHING_REGION_FILTERS: ItCoachingRegionFilter[] = [
  { id: 'SEOUL', label: '서울' },
  { id: 'GYEONGGI_NORTH', label: '경기 북부' },
  { id: 'GYEONGGI_SOUTH', label: '경기 남부' },
  { id: 'BUSAN', label: '부산' },
  { id: 'DAEGU', label: '대구' },
  { id: 'INCHEON', label: '인천' },
  { id: 'GWANGJU', label: '광주' },
  { id: 'DAEJEON', label: '대전' },
  { id: 'ULSAN', label: '울산' },
  { id: 'SEJONG', label: '세종' },
];

export const IT_COACHING_TECH_STACK_VISIBLE_COUNT = 10;

export const IT_COACHING_REGION_VISIBLE_COUNT = 10;
