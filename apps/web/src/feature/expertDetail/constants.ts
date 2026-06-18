import type { ExpertReportReason } from './types';

export const EXPERT_DETAIL_PAGE_MAX_WIDTH = 1176;

export const EXPERT_DETAIL_PORTFOLIO_PREVIEW_COUNT = 4;

export const EXPERT_DETAIL_CLIENT_PREVIEW_COUNT = 2;

export const EXPERT_REPORT_MAX_FILES = 3;

export const EXPERT_REPORT_MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export const EXPERT_REPORT_MIN_DETAIL_LENGTH = 10;

export const EXPERT_INQUIRY_MODAL_MAX_WIDTH = 480;

export const EXPERT_REPORT_REASON_OPTIONS: {
  value: ExpertReportReason;
  label: string;
}[] = [
  { value: 'FALSE_INFORMATION', label: '허위·과장 정보' },
  { value: 'ABUSE', label: '욕설·비방' },
  { value: 'ILLEGAL_ACTIVITY', label: '불법 행위/사기 의심' },
  { value: 'EXTERNAL_CONTACT', label: '외부 연락처 유도' },
  { value: 'SPAM', label: '스팸/광고' },
  { value: 'OTHER', label: '기타' },
];
