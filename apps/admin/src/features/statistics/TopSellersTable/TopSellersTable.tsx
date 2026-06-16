import { typography } from '@repo/styles/typography';
import { formatDate } from '@repo/utils';

import * as styles from './TopSellersTable.css';

import type { ColDef } from '@/components/common/AdminTable';
import type { TopSellerItem } from '@/features/statistics/types';

import { AdminTable } from '@/components/common/AdminTable';
import { PROVIDER_LABEL, REGION_LABEL } from '@/utils/constants';
import { toManwon } from '@/utils/formatCurrency';
import { calcDayCount, formatDisplayDate } from '@/utils/formatDate';

interface Props {
  data: TopSellerItem[];
  startDate: string;
  endDate: string;
}

const COLS: ColDef<TopSellerItem>[] = [
  {
    key: 'no',
    header: '번호',
    headerStyle: styles.colNo,
    cellStyle: styles.colNo,
    render: (_, rowNum) => rowNum,
  },
  {
    key: 'businessName',
    header: '회사명',
    headerStyle: styles.colBusiness,
    cellStyle: styles.colBusiness,
    render: (item) => item.businessName ?? '-',
  },
  {
    key: 'email',
    header: '이메일',
    headerStyle: styles.colEmailHeader,
    cellStyle: styles.colEmailCell,
    render: (item) => <span className={styles.emailText}>{item.email}</span>,
  },
  {
    key: 'provider',
    header: '가입경로',
    headerStyle: styles.colProvider,
    cellStyle: styles.colProvider,
    render: (item) => PROVIDER_LABEL[item.provider],
  },
  {
    key: 'totalTransactionAmount',
    header: '거래액',
    headerStyle: styles.colAmount,
    cellStyle: styles.colAmount,
    render: (item) => `${toManwon(item.totalTransactionAmount)}원`,
  },
  {
    key: 'region',
    header: '지역',
    headerStyle: styles.colRegion,
    cellStyle: styles.colRegion,
    render: (item) =>
      item.region === null ? '-' : (REGION_LABEL[item.region] ?? item.region),
  },
  {
    key: 'totalTransactionCount',
    header: '판매(건)',
    headerStyle: styles.colCount,
    cellStyle: styles.colCount,
    render: (item) => item.totalTransactionCount,
  },
  {
    key: 'avgRating',
    header: '평점',
    headerStyle: styles.colRating,
    cellStyle: styles.colRating,
    render: (item) =>
      item.avgRating === null ? '-' : item.avgRating.toFixed(1),
  },
  {
    key: 'createdAt',
    header: '가입일',
    headerStyle: styles.colDate,
    cellStyle: styles.colDate,
    render: (item) => formatDate(item.createdAt),
  },
];

export default function TopSellersTable({ data, startDate, endDate }: Props) {
  const subtitle = `${formatDisplayDate(startDate)} ~ ${formatDisplayDate(endDate)} ${calcDayCount(startDate, endDate)}일 기준`;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <p className={`${typography.f16EB} ${styles.headerTitle}`}>
          TOP 10 판매자
        </p>
        <p className={`${typography.f12R} ${styles.headerSubtitle}`}>
          {subtitle}
        </p>
      </div>
      <AdminTable
        cols={COLS}
        items={data}
        getKey={(item) => item.sellerUserId}
        page={1}
        pageSize={10}
        borderless
      />
    </div>
  );
}
