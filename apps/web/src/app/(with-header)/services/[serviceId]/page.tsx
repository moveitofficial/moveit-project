import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

import { getServiceDetailPageData } from '@/feature/serviceDetail/api';
import { ServiceDetailView } from '@/feature/serviceDetail/components/ServiceDetailView';
import { resolveViewerRole } from '@/feature/serviceDetail/utils';
import { getMockAuthUser } from '@/mocks/user';

interface Props {
  params: Promise<{ serviceId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { serviceId } = await params;
  const data = await getServiceDetailPageData(serviceId);

  if (data === null) {
    return { title: '서비스 상세 | moveit' };
  }

  return { title: `${data.service.title} | moveit` };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { serviceId } = await params;
  const data = await getServiceDetailPageData(serviceId);

  if (data === null) {
    notFound();
  }

  const currentUser = getMockAuthUser();
  const viewerRole = resolveViewerRole(
    currentUser?.id ?? null,
    data.service.expert.id,
  );

  return <ServiceDetailView data={data} viewerRole={viewerRole} />;
}
