import type { Metadata } from 'next';

import ExpertDetailPageContent, {
  generateExpertDetailMetadata,
} from '@/feature/expertDetail/pageContent';

interface Props {
  params: Promise<{ userId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = await params;
  return generateExpertDetailMetadata(userId);
}

export default async function ExpertDetailPage({ params }: Props) {
  const { userId } = await params;

  return <ExpertDetailPageContent expertUserId={userId} />;
}
