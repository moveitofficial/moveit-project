import { notFound } from 'next/navigation';

import { getServiceDetailPageData } from './api';
import { ServiceDetailView } from './components/ServiceDetailView';
import { resolveViewerRole } from './utils';

import type { ServiceDetailViewerRole } from './types';
import type { ServiceGroupName } from '@/mocks/types';
import type { Metadata } from 'next';

import { getMockAuthUser } from '@/mocks/user';

interface ServiceDetailPageResult {
  data: NonNullable<Awaited<ReturnType<typeof getServiceDetailPageData>>>;
  viewerRole: ServiceDetailViewerRole;
}

export async function getServiceDetailPageResult(
  serviceId: string,
  expectedGroup?: ServiceGroupName,
): Promise<ServiceDetailPageResult | null> {
  const data = await getServiceDetailPageData(serviceId);

  if (data === null) {
    return null;
  }

  if (
    expectedGroup !== undefined &&
    data.service.categoryRef.group !== expectedGroup
  ) {
    return null;
  }

  const currentUser = getMockAuthUser();
  const viewerRole = resolveViewerRole(
    currentUser?.id ?? null,
    data.service.expert.id,
  );

  return { data, viewerRole };
}

export async function generateServiceDetailMetadata(
  serviceId: string,
  expectedGroup?: ServiceGroupName,
): Promise<Metadata> {
  const result = await getServiceDetailPageResult(serviceId, expectedGroup);

  if (result === null) {
    return { title: '서비스 상세 | moveit' };
  }

  return { title: `${result.data.service.title} | moveit` };
}

interface ServiceDetailPageContentProps {
  serviceId: string;
  expectedGroup?: ServiceGroupName;
}

export default async function ServiceDetailPageContent({
  serviceId,
  expectedGroup,
}: ServiceDetailPageContentProps) {
  const result = await getServiceDetailPageResult(serviceId, expectedGroup);

  if (result === null) {
    notFound();
  }

  return (
    <ServiceDetailView data={result.data} viewerRole={result.viewerRole} />
  );
}
