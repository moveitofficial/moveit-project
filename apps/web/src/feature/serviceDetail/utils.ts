import type { ServiceDetailViewerRole } from './types';
import type { ServiceCategoryRef, ServiceGroupName } from '@/mocks/types';
import type { Route } from 'next';

import {
  mockServiceCategories,
  mockServiceGroups,
} from '@/mocks/metadata';

export function buildServiceDetailHref(
  serviceId: string,
  group: ServiceGroupName,
): Route {
  const query = new URLSearchParams({ group });
  return `/services/${serviceId}?${query.toString()}` as Route;
}

export function parseServiceGroupParam(
  value: string | null,
): ServiceGroupName | null {
  if (value === 'IT_COACHING' || value === 'PROJECT_REQUEST') {
    return value;
  }

  return null;
}

export function resolveViewerRole(
  currentUserId: string | null,
  expertUserId: string,
): ServiceDetailViewerRole {
  if (currentUserId === null) {
    return 'guest';
  }

  if (currentUserId === expertUserId) {
    return 'owner';
  }

  return 'client';
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
