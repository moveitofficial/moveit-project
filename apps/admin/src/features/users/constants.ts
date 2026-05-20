import type { ExpertApprovalStatus, Provider, ServiceType } from '@/mocks/types';

export const PROVIDER_LABEL: Record<Provider, string> = {
  LOCAL: '이메일',
  GOOGLE: '구글',
  KAKAO: '카카오',
  NAVER: '네이버',
};

export const APPROVAL_STATUS_LABEL: Record<ExpertApprovalStatus, string> = {
  APPROVED: '승인',
  PENDING: '승인요청',
  REJECTED: '승인거절',
};

export const SERVICE_TYPE_LABEL: Record<ServiceType, string> = {
  IT_COACHING: 'IT코칭',
  PROJECT_REQUEST: '프로젝트의뢰',
};

export const PROVIDER_OPTIONS: { value: Provider; label: string }[] = [
  { value: 'LOCAL', label: '이메일' },
  { value: 'GOOGLE', label: '구글' },
  { value: 'KAKAO', label: '카카오' },
  { value: 'NAVER', label: '네이버' },
];

export const REGION_LABEL: Record<string, string> = {
  SEOUL: '서울',
  BUSAN: '부산',
  DAEGU: '대구',
  INCHEON: '인천',
  GWANGJU: '광주',
  DAEJEON: '대전',
  ULSAN: '울산',
  SEJONG: '세종',
  GYEONGGI_NORTH: '경기 북부',
  GYEONGGI_SOUTH: '경기 남부',
  GANGWON: '강원',
  CHUNGBUK: '충북',
  CHUNGNAM: '충남',
  JEONBUK: '전북',
  JEONNAM: '전남',
  GYEONGBUK: '경북',
  GYEONGNAM: '경남',
  JEJU: '제주',
};

export const REGION_OPTIONS: { value: string; label: string }[] = Object.entries(REGION_LABEL).map(
  ([value, label]) => ({ value, label }),
);

export const PAGE_SIZE_OPTIONS: { value: string; label: string }[] = [
  { value: '50', label: '50개씩' },
  { value: '100', label: '100개씩' },
  { value: '500', label: '500개씩' },
];

export const EXPERT_STATUS_OPTIONS: { value: ExpertApprovalStatus; label: string }[] = [
  { value: 'APPROVED', label: '승인' },
  { value: 'PENDING', label: '대기' },
  { value: 'REJECTED', label: '거절' },
];

export const SPECIALTY_OPTIONS: { value: ServiceType; label: string }[] = [
  { value: 'IT_COACHING', label: 'IT 코칭' },
  { value: 'PROJECT_REQUEST', label: '프로젝트 의뢰' },
];
