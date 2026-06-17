import { EXPERT_DETAIL_CLIENT_PREVIEW_COUNT } from './constants';

import type {
  ExpertDetailDisplayStats,
  ExpertDetailBusinessInfo,
  ExpertDetailViewerRole,
} from './types';
import type { ExpertDetail } from '@/mocks/types';
import type { Role } from '@/types/enums';


import { REGIONS } from '@/feature/signup/components/common/regions';

// 협업사 이름은 서버가 주는 전체 목록에서 랜덤 2개만 노출(요청마다 무작위).
function pickRandomClientNames(names: string[]): string[] {
  if (names.length <= EXPERT_DETAIL_CLIENT_PREVIEW_COUNT) {
    return names;
  }
  return [...names]
    .sort(() => Math.random() - 0.5)
    .slice(0, EXPERT_DETAIL_CLIENT_PREVIEW_COUNT);
}

function getRegionLabel(region: ExpertDetail['region']): string | null {
  if (region === null || region === undefined) {
    return null;
  }

  return REGIONS.find((item) => item.id === region)?.label ?? region;
}

function formatEmployeeRange(
  min: number | null | undefined,
  max: number | null | undefined,
): string | null {
  if (min === null || min === undefined) {
    return null;
  }

  if (max === null || max === undefined) {
    return `${String(min)}명 이상`;
  }

  return `${String(min)}명이상 ~ ${String(max)}명미만`;
}

function formatContactTimePart(value: string): string {
  const [hourText, minuteText = '00'] = value.split(':');
  const hour = Number(hourText);
  const period = hour < 12 ? 'AM' : 'PM';
  const displayHour = hour > 12 ? hour - 12 : hour;

  return `${period} ${String(displayHour).padStart(2, '0')}:${minuteText}`;
}

function formatContactTime(
  start: string | undefined,
  end: string | undefined,
): string {
  if (start === undefined || end === undefined) {
    return '평일 : AM 09:00 ~ PM 06:00';
  }

  return `평일 : ${formatContactTimePart(start)} ~ ${formatContactTimePart(end)}`;
}

export function resolveExpertDetailViewer(
  currentUser: { id: string; role: Role } | null,
  expertUserId: string,
): ExpertDetailViewerRole {
  if (currentUser === null) {
    return 'guest';
  }

  if (currentUser.id === expertUserId) {
    return 'owner';
  }

  if (currentUser.role === 'EXPERT') {
    return 'expert-other';
  }

  return 'client';
}

function isAbsentOrderCount(value: number | null | undefined): boolean {
  return value === null || value === undefined || value === 0;
}

function isAbsentRate(value: number | null | undefined): boolean {
  return value === null || value === undefined;
}

export function buildExpertDisplayStats(expert: ExpertDetail): ExpertDetailDisplayStats {
  const totalOrderCount = expert.totalOrderCount ?? null;
  const reviewCount = expert.stats.totalReviews;
  const serviceCount = expert.serviceCount ?? expert.services.length;
  const averageRating = expert.stats.averageRating;
  const purchaseRate = expert.stats.purchaseRate;
  const completionRate = expert.stats.completionRate;

  const isNewExpert =
    isAbsentOrderCount(totalOrderCount) &&
    isAbsentRate(averageRating) &&
    isAbsentRate(purchaseRate) &&
    isAbsentRate(completionRate);

  return {
    totalOrderCount: totalOrderCount ?? 0,
    serviceCount,
    averageRating: averageRating ?? 0,
    reviewCount,
    purchaseRate: purchaseRate ?? 0,
    completionRate: completionRate ?? 0,
    isNewExpert,
  };
}

export function buildExpertBusinessInfo(expert: ExpertDetail): ExpertDetailBusinessInfo {
  return {
    clientNames: pickRandomClientNames(expert.clientNames ?? []),
    foundedYear: expert.foundedYear ?? null,
    regionLabel: getRegionLabel(expert.region),
    employeeRangeLabel: formatEmployeeRange(
      expert.employeeMin,
      expert.employeeMax,
    ),
    contactTimeLabel: formatContactTime(
      expert.contactTimeStart,
      expert.contactTimeEnd,
    ),
  };
}

export function getExpertInitials(companyName: string): string {
  return companyName.replaceAll(' ', '').slice(0, 2);
}

export function canInteractWithExpert(viewer: ExpertDetailViewerRole): boolean {
  return viewer === 'client';
}
