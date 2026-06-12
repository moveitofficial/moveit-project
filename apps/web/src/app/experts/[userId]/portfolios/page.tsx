import type { Metadata } from 'next';

import {
  getExpertPortfolioList,
  getPortfolioModalExpertContext,
} from '@/feature/portfolioDetail/api';
import { ExpertPortfoliosView } from '@/feature/portfolioDetail/components/ExpertPortfoliosView';

interface Props {
  params: Promise<{ userId: string }>;
}

export const metadata: Metadata = {
  title: '포트폴리오 | moveit',
};

export default async function ExpertPortfoliosPage({ params }: Props) {
  const { userId } = await params;
  const [portfolios, expert] = await Promise.all([
    getExpertPortfolioList(userId),
    getPortfolioModalExpertContext(userId),
  ]);

  return <ExpertPortfoliosView portfolios={portfolios} expert={expert} />;
}
