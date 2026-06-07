import { formatDate } from '@repo/utils';

import * as styles from './BlacklistTable.css';

import type { ColDef } from '@/components/common/AdminTable';
import type { UserTabType } from '@/components/common/UserTabs';
import type { BlacklistItem } from '@/features/blacklist/types';

import { AdminTable } from '@/components/common/AdminTable';
import { PROVIDER_LABEL, REGION_LABEL } from '@/utils/constants';

function renderReportCount(count: number) {
  const className =
    count === 0 ? styles.reportGray : count >= 4 ? styles.reportRed : undefined;

  return <span className={className}>{count}</span>;
}

const CLIENT_COLS: ColDef<BlacklistItem>[] = [
  {
    key: 'no',
    header: '번호',
    headerStyle: styles.colNo,
    cellStyle: styles.colNo,
    render: (_, n) => n,
  },
  {
    key: 'name',
    header: '이름',
    headerStyle: styles.colName,
    cellStyle: styles.colName,
    render: (item) => item.name ?? '-',
  },
  {
    key: 'email',
    header: '이메일',
    headerStyle: styles.colEmailHeader,
    cellStyle: styles.colEmail,
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
    key: 'status',
    header: '상태',
    headerStyle: styles.colStatus,
    cellStyle: styles.colStatus,
    render: () => <span className={styles.statusText}>블랙리스트</span>,
  },
  {
    key: 'region',
    header: '지역',
    headerStyle: styles.colRegion,
    cellStyle: styles.colRegion,
    render: (item) => REGION_LABEL[item.region ?? ''] ?? '-',
  },
  {
    key: 'paymentCount',
    header: '결제(건)',
    headerStyle: styles.colCount,
    cellStyle: styles.colCount,
    render: (item) => item.paymentCount,
  },
  {
    key: 'reportCount',
    header: '신고',
    headerStyle: styles.colReport,
    cellStyle: styles.colReport,
    render: (item) => renderReportCount(item.reportCount),
  },
  {
    key: 'createdAt',
    header: '가입일',
    headerStyle: styles.colDate,
    cellStyle: styles.colDate,
    render: (item) => formatDate(item.createdAt),
  },
];

const EXPERT_COLS: ColDef<BlacklistItem>[] = [
  {
    key: 'no',
    header: '번호',
    headerStyle: styles.colNo,
    cellStyle: styles.colNo,
    render: (_, n) => n,
  },
  {
    key: 'businessName',
    header: '회사명',
    headerStyle: styles.colCompanyName,
    cellStyle: styles.colCompanyName,
    render: (item) => item.businessName ?? '-',
  },
  {
    key: 'email',
    header: '이메일',
    headerStyle: styles.colEmailHeader,
    cellStyle: styles.colEmail,
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
    key: 'status',
    header: '상태',
    headerStyle: styles.colStatus,
    cellStyle: styles.colStatus,
    render: () => <span className={styles.statusText}>블랙리스트</span>,
  },
  {
    key: 'region',
    header: '지역',
    headerStyle: styles.colRegion,
    cellStyle: styles.colRegion,
    render: (item) => REGION_LABEL[item.region ?? ''] ?? '-',
  },
  {
    key: 'paymentCount',
    header: '판매(건)',
    headerStyle: styles.colCount,
    cellStyle: styles.colCount,
    render: (item) => item.paymentCount,
  },
  {
    key: 'reportCount',
    header: '신고',
    headerStyle: styles.colReport,
    cellStyle: styles.colReport,
    render: (item) => renderReportCount(item.reportCount),
  },
  {
    key: 'createdAt',
    header: '가입일',
    headerStyle: styles.colDate,
    cellStyle: styles.colDate,
    render: (item) => formatDate(item.createdAt),
  },
];

interface Props {
  tab: UserTabType;
  items: BlacklistItem[];
  page: number;
  pageSize: number;
}

export default function BlacklistTable({ tab, items, page, pageSize }: Props) {
  const cols = tab === 'CLIENT' ? CLIENT_COLS : EXPERT_COLS;

  return (
    <AdminTable
      cols={cols}
      items={items}
      getKey={(item) => item.id}
      page={page}
      pageSize={pageSize}
    />
  );
}
