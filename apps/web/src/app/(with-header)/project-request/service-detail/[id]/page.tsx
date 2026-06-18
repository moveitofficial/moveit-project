import type { Metadata } from 'next';

import ServiceDetailPageContent, {
  generateServiceDetailMetadata,
} from '@/feature/serviceDetail/pageContent';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return generateServiceDetailMetadata(id, 'PROJECT_REQUEST');
}

export default async function ProjectRequestServiceDetailPage({
  params,
}: Props) {
  const { id } = await params;

  return (
    <ServiceDetailPageContent serviceId={id} expectedGroup="PROJECT_REQUEST" />
  );
}
