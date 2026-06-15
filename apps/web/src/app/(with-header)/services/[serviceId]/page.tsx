import type { Metadata } from 'next';

import ServiceDetailPageContent, {
  generateServiceDetailMetadata,
} from '@/feature/serviceDetail/pageContent';

interface Props {
  params: Promise<{ serviceId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { serviceId } = await params;
  return generateServiceDetailMetadata(serviceId);
}

export default async function ServiceDetailPage({ params }: Props) {
  const { serviceId } = await params;

  return <ServiceDetailPageContent serviceId={serviceId} />;
}
