import { formatDate } from '@repo/utils';

import * as styles from './BlacklistTable.css';

import type { ColDef } from '@/components/common/AdminTable';
import type { UserTabType } from '@/components/common/UserTabs';
import type { AdminBlacklistExpert, AdminBlacklistUser } from '@/mocks/types';

import { AdminTable } from '@/components/common/AdminTable';
import { PROVIDER_LABEL, REGION_LABEL } from '@/utils/constants';

function renderReportCount(count: number) {
  const className =
    count === 0 ? styles.reportGray : count >= 4 ? styles.reportRed : undefined;

  return <span className={className}>{count}</span>;
}

const CLIENT_COLS: ColDef<AdminBlacklistUser>[] = [
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
    render: (item) => item.name,
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
    render: (item) => REGION_LABEL[item.region] ?? '-',
  },
  {
    key: 'orderCount',
    header: '결제(건)',
    headerStyle: styles.colCount,
    cellStyle: styles.colCount,
    render: (item) => item.orderCount,
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

const EXPERT_COLS: ColDef<AdminBlacklistExpert>[] = [
  {
    key: 'no',
    header: '번호',
    headerStyle: styles.colNo,
    cellStyle: styles.colNo,
    render: (_, n) => n,
  },
  {
    key: 'companyName',
    header: '회사명',
    headerStyle: styles.colCompanyName,
    cellStyle: styles.colCompanyName,
    render: (item) => item.companyName,
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
    render: (item) => REGION_LABEL[item.region] ?? '-',
  },
  {
    key: 'totalOrders',
    header: '판매(건)',
    headerStyle: styles.colCount,
    cellStyle: styles.colCount,
    render: (item) => item.totalOrders,
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
  items: (AdminBlacklistUser | AdminBlacklistExpert)[];
  page: number;
  pageSize: number;
}

export default function BlacklistTable({ tab, items, page, pageSize }: Props) {
  if (tab === 'CLIENT') {
    return (
      <AdminTable
        cols={CLIENT_COLS}
        items={items as AdminBlacklistUser[]}
        getKey={(item) => item.id}
        page={page}
        pageSize={pageSize}
      />
    );
  }

  return (
    <AdminTable
      cols={EXPERT_COLS}
      items={items as AdminBlacklistExpert[]}
      getKey={(item) => item.id}
      page={page}
      pageSize={pageSize}
    />
  );
}
