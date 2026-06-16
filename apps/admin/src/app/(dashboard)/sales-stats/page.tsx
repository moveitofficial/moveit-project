import { redirect } from 'next/navigation';

import * as styles from './page.css';

import { getSalesStatistics } from '@/features/statistics/api';
import { CategorySalesTable } from '@/features/statistics/CategorySalesTable';
import { DailySalesChart } from '@/features/statistics/DailySalesChart';
import { SalesStatsFilter } from '@/features/statistics/SalesStatsFilter';
import { SalesStatsSummary } from '@/features/statistics/SalesStatsSummary';
import { TopSellersTable } from '@/features/statistics/TopSellersTable';
import { toDateStr } from '@/utils/formatDate';
import { param } from '@/utils/queryParams';

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SalesStatsPage({ searchParams }: Props) {
  const rawParams = await searchParams;

  const startDate = param(rawParams.startDate);
  const endDate = param(rawParams.endDate);

  if (!startDate || !endDate) {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 29);

    redirect(
      `/sales-stats?startDate=${toDateStr(start)}&endDate=${toDateStr(end)}`,
    );
  }

  const result = await getSalesStatistics({ startDate, endDate });
  const { summary, dailySales, categorySales, topSellers } = result.data;

  return (
    <div className={styles.container}>
      <SalesStatsFilter />

      <SalesStatsSummary summary={summary} />

      <div className={styles.twoColGrid}>
        <DailySalesChart
          data={dailySales}
          startDate={startDate}
          endDate={endDate}
        />
        <CategorySalesTable
          data={categorySales}
          startDate={startDate}
          endDate={endDate}
        />
      </div>

      <TopSellersTable
        data={topSellers}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
}
