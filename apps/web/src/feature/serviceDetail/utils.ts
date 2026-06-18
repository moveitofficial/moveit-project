import type { ServiceDetailViewerRole } from './types';
import type { ServiceCategoryRef, ServiceGroupName } from '@/mocks/types';
import type { Role } from '@/types/enums';
import type { Route } from 'next';

import {
  mockServiceCategories,
  mockServiceGroups,
} from '@/mocks/metadata';

export function buildServiceDetailHref(
  serviceId: string,
  group: ServiceGroupName,
): Route {
  const basePath =
    group === 'IT_COACHING' ? '/it-coaching' : '/project-request';
  return `${basePath}/service-detail/${serviceId}` as Route;
}

export function resolveViewerRole(
  role: Role | null,
): ServiceDetailViewerRole {
  if (role === null) {
    return 'guest';
  }

  // 판매자(EXPERT)는 구매 주체가 아니므로 바로구매·상담 버튼을 노출하지 않는다.
  return role === 'EXPERT' ? 'owner' : 'client';
}

export function getServiceGroupLabel(group: ServiceCategoryRef['group']): string {
  return (
    mockServiceGroups.find((item) => item.name === group)?.label ?? group
  );
}

export function getServiceCategoryLabel(
  category: ServiceCategoryRef['category'],
): string {
  return (
    mockServiceCategories.find((item) => item.name === category)?.label ??
    category
  );
}

export function buildServiceDetailBreadcrumb(categoryRef: ServiceCategoryRef): {
  groupLabel: string;
  categoryLabel: string;
} {
  return {
    groupLabel: getServiceGroupLabel(categoryRef.group),
    categoryLabel: getServiceCategoryLabel(categoryRef.category),
  };
}

export function maskReviewerName(name: string): string {
  return `${name}***`;
}

export function parseDescriptionSections(description: string): {
  recommendedLines: string[];
  bodyParagraphs: string[];
} {
  const lines = description
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const recommendedLines = lines.filter((line) => line.startsWith('- ')).map(
    (line) => line.slice(2),
  );

  const bodyParagraphs =
    recommendedLines.length > 0
      ? lines.filter((line) => !line.startsWith('- '))
      : lines;

  return { recommendedLines, bodyParagraphs };
}
