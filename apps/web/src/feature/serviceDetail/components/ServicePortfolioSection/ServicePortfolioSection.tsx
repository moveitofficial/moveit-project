import Link from 'next/link';


import * as sectionStyles from '../ServiceDetailView/ServiceDetailView.css';

import * as styles from './ServicePortfolioSection.css';

import type { PortfolioModalExpertContext } from '@/feature/portfolioDetail/types';
import type { PortfolioListItem } from '@/mocks/types';

import { PortfolioCardGrid } from '@/feature/portfolioDetail/components/PortfolioCardGrid';
import { buildExpertPortfoliosHref } from '@/feature/portfolioDetail/utils';

interface Props {
  expertUserId: string;
  serviceId: string;
  expert: PortfolioModalExpertContext;
  portfolios: PortfolioListItem[];
  hasMore: boolean;
}

export default function ServicePortfolioSection({
  expertUserId,
  serviceId,
  expert,
  portfolios,
  hasMore,
}: Props) {
  if (portfolios.length === 0) {
    return null;
  }

  return (
    <section id="portfolio" className={sectionStyles.section}>
      <div className={styles.header}>
        <h2 className={sectionStyles.sectionTitle}>포트폴리오</h2>
        {hasMore ? (
          <Link
            href={buildExpertPortfoliosHref(expertUserId)}
            className={styles.moreLink}
          >
            더보기
          </Link>
        ) : null}
      </div>

      <PortfolioCardGrid
        portfolios={portfolios}
        expert={expert}
        expertUserId={expertUserId}
        serviceId={serviceId}
      />
    </section>
  );
}
