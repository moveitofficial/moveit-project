export const MAX_DETAIL_IMAGES = 10;
export const DESC_MAX_LENGTH = 500;

export const BUSINESS_SECTORS = [
  { id: 'PUBLIC_INSTITUTION', label: '공기업 / 공공기관' },
  { id: 'ECOMMERCE', label: '온라인 쇼핑몰' },
  { id: 'LEGAL_TAX', label: '법률 / 세무' },
  { id: 'REAL_ESTATE', label: '부동산 / 분양' },
  { id: 'MEDICAL_PHARMA', label: '병원 / 제약' },
] as const;

export type BusinessSectorId = (typeof BUSINESS_SECTORS)[number]['id'];
