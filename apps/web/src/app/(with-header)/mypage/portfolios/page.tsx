import type { Metadata } from 'next';

import { PortfolioView } from '@/feature/user/components';

export const metadata: Metadata = {
  title: '포트폴리오 관리 | moveit',
};

export default function PortfoliosPage() {
  return <PortfolioView />;
}
