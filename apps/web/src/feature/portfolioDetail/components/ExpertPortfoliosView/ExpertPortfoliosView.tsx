import { PortfolioCardGrid } from '../PortfolioCardGrid';
import * as styles from '../PortfolioCardGrid/PortfolioCardGrid.css';

import type { PortfolioModalExpertContext } from '../../types';
import type { PortfolioListItem } from '@/mocks/types';

interface Props {
  portfolios: PortfolioListItem[];
  expert: PortfolioModalExpertContext;
}

export default function ExpertPortfoliosView({ portfolios, expert }: Props) {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>포트폴리오</h1>
      <PortfolioCardGrid portfolios={portfolios} expert={expert} />
    </div>
  );
}
