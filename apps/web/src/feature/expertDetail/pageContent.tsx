import { notFound } from 'next/navigation';

import { getExpertDetailPageResult } from './api';
import ExpertDetailView from './components/ExpertDetailView/ExpertDetailView';

import type { Metadata } from 'next';

export async function generateExpertDetailMetadata(
  expertUserId: string,
): Promise<Metadata> {
  const result = await getExpertDetailPageResult(expertUserId);

  if (result === null) {
    return { title: '전문가 상세 | moveit' };
  }

  return { title: `${result.data.expert.companyName} | moveit` };
}

interface ExpertDetailPageContentProps {
  expertUserId: string;
}

export default async function ExpertDetailPageContent({
  expertUserId,
}: ExpertDetailPageContentProps) {
  const result = await getExpertDetailPageResult(expertUserId);

  if (result === null) {
    notFound();
  }

  return <ExpertDetailView data={result.data} viewer={result.viewer} />;
}
