import type {
  ExpertApprovalStatus,
  Provider,
  ServiceType,
  ServiceStatus,
  ReportReason,
  SettlementStatus,
} from '@/types/enums';

export const PROVIDER_LABEL: Record<Provider, string> = {
  LOCAL: '이메일',
  GOOGLE: '구글',
  KAKAO: '카카오',
  NAVER: '네이버',
};

export const PROVIDER_OPTIONS = (
  Object.entries(PROVIDER_LABEL) as [Provider, string][]
).map(([value, label]) => ({ value, label }));

export const EXPERT_STATUS_LABEL: Record<ExpertApprovalStatus, string> = {
  APPROVED: '승인',
  PENDING: '승인요청',
  REJECTED: '승인거절',
};

export const EXPERT_STATUS_OPTIONS = (
  Object.entries(EXPERT_STATUS_LABEL) as [ExpertApprovalStatus, string][]
).map(([value, label]) => ({ value, label }));

export const SERVICE_TYPE_LABEL: Record<ServiceType, string> = {
  IT_COACHING: 'IT코칭',
  PROJECT_REQUEST: '프로젝트의뢰',
};

export const SERVICE_TYPE_OPTIONS = (
  Object.entries(SERVICE_TYPE_LABEL) as [ServiceType, string][]
).map(([value, label]) => ({ value, label }));

export const SERVICE_STATUS_LABEL: Record<ServiceStatus, string> = {
  ACTIVE: '판매중',
  PAUSED: '판매 중지',
  CLOSED: '삭제',
};

export const SERVICE_STATUS_OPTIONS = (
  Object.entries(SERVICE_STATUS_LABEL) as [ServiceStatus, string][]
).map(([value, label]) => ({ value, label }));

export const REPORT_REASON_LABEL: Record<ReportReason, string> = {
  FALSE_INFORMATION: '허위·과장 정보',
  ABUSE: '욕설·비방',
  ILLEGAL_ACTIVITY: '불법 행위/사기 의심',
  EXTERNAL_CONTACT: '외부 연락처 유도',
  SPAM: '스팸/광고',
  OTHER: '기타',
};

export const REPORT_REASON_OPTIONS = (
  Object.entries(REPORT_REASON_LABEL) as [ReportReason, string][]
).map(([value, label]) => ({ value, label }));

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

export const REGION_OPTIONS: { value: string; label: string }[] =
  Object.entries(REGION_LABEL).map(([value, label]) => ({ value, label }));

export const PAGE_SIZE_OPTIONS: { value: string; label: string }[] = [
  { value: '50', label: '50개씩' },
  { value: '100', label: '100개씩' },
  { value: '500', label: '500개씩' },
];

export const SETTLEMENT_STATUS_LABEL: Record<SettlementStatus, string> = {
  SETTLEMENT_REQUESTED: '정산요청',
  SETTLEMENT_COMPLETED: '정산완료',
};

export const SETTLEMENT_STATUS_OPTIONS = (
  Object.entries(SETTLEMENT_STATUS_LABEL) as [SettlementStatus, string][]
).map(([value, label]) => ({ value, label }));
