import type { Metadata } from 'next';

import ServiceDetailPageContent, {
  generateServiceDetailMetadata,
} from '@/feature/serviceDetail/pageContent';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return generateServiceDetailMetadata(id, 'IT_COACHING');
}

export default async function ItCoachingServiceDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <ServiceDetailPageContent serviceId={id} expectedGroup="IT_COACHING" />
  );
}
