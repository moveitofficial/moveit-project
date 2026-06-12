import type { BusinessSector, StackType } from '@/mocks/types';
import type { Route } from 'next';

const BUSINESS_SECTOR_LABELS: Record<BusinessSector, string> = {
  PUBLIC_INSTITUTION: '공기업 / 공공기관',
  ECOMMERCE: '온라인 쇼핑몰',
  LEGAL_TAX: '법률 / 세무',
  REAL_ESTATE: '부동산 / 분양',
  MEDICAL_PHARMA: '병원 / 제약',
};

const STACK_TYPE_LABELS: Record<StackType, string> = {
  DESIGN: '디자인',
  FRONTEND: '프론트엔드',
  BACKEND: '백엔드',
};

export function getBusinessSectorLabel(sector: BusinessSector): string {
  return BUSINESS_SECTOR_LABELS[sector];
}

export function getStackTypeLabel(stackType: StackType): string {
  return STACK_TYPE_LABELS[stackType];
}

export function buildExpertPortfoliosHref(expertUserId: string): Route {
  return `/experts/${expertUserId}/portfolios` as Route;
}

export function getExpertInitials(companyName: string): string {
  return companyName.replaceAll(' ', '').slice(0, 2);
}
