import { formatDate } from '@repo/utils';

import * as styles from './UserTable.css';

import type { ColDef } from '@/components/common/AdminTable';
import type { UserTabType } from '@/components/common/UserTabs';
import type { AdminExpert, AdminUser } from '@/mocks/types';

import { AdminTable } from '@/components/common/AdminTable';
import {
  EXPERT_STATUS_LABEL,
  PROVIDER_LABEL,
  REGION_LABEL,
  SERVICE_TYPE_LABEL,
} from '@/utils/constants';

function renderReportCount(count: number) {
  const className =
    count === 0 ? styles.reportGray : count >= 4 ? styles.reportRed : undefined;

  return <span className={className}>{count}</span>;
}

const CLIENT_COLS: ColDef<AdminUser>[] = [
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
    render: (client) => client.name,
  },
  {
    key: 'email',
    header: '이메일',
    headerStyle: styles.colEmailHeader,
    cellStyle: styles.colEmail,
    render: (client) => (
      <span className={styles.emailText}>{client.email}</span>
    ),
  },
  {
    key: 'provider',
    header: '가입경로',
    headerStyle: styles.colProvider,
    cellStyle: styles.colProvider,
    render: (client) => PROVIDER_LABEL[client.provider],
  },
  {
    key: 'region',
    header: '지역',
    headerStyle: styles.colRegion,
    cellStyle: styles.colRegion,
    render: (client) => REGION_LABEL[client.region] ?? '-',
  },
  {
    key: 'orderCount',
    header: '결제(건)',
    headerStyle: styles.colCount,
    cellStyle: styles.colCount,
    render: (client) => client.orderCount,
  },
  {
    key: 'reportCount',
    header: '신고',
    headerStyle: styles.colReport,
    cellStyle: styles.colReport,
    render: (client) => renderReportCount(client.reportCount),
  },
  {
    key: 'createdAt',
    header: '가입일',
    headerStyle: styles.colDate,
    cellStyle: styles.colDate,
    render: (client) => formatDate(client.createdAt),
  },
];

const EXPERT_COLS: ColDef<AdminExpert>[] = [
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
    render: (expert) => expert.companyName,
  },
  {
    key: 'email',
    header: '이메일',
    headerStyle: styles.colEmailHeader,
    cellStyle: styles.colEmail,
    render: (expert) => (
      <span className={styles.emailText}>{expert.email}</span>
    ),
  },
  {
    key: 'serviceType',
    header: '전문분야',
    headerStyle: styles.colServiceType,
    cellStyle: styles.colServiceType,
    render: (expert) => SERVICE_TYPE_LABEL[expert.serviceType],
  },
  {
    key: 'provider',
    header: '가입경로',
    headerStyle: styles.colProvider,
    cellStyle: styles.colProvider,
    render: (expert) => PROVIDER_LABEL[expert.provider],
  },
  {
    key: 'approvalStatus',
    header: '상태',
    headerStyle: styles.colStatus,
    cellStyle: styles.colStatus,
    render: (expert) => (
      <span
        className={
          expert.approvalStatus === 'REJECTED' ? styles.reportRed : undefined
        }
      >
        {EXPERT_STATUS_LABEL[expert.approvalStatus]}
      </span>
    ),
  },
  {
    key: 'region',
    header: '지역',
    headerStyle: styles.colRegion,
    cellStyle: styles.colRegion,
    render: (expert) => REGION_LABEL[expert.region] ?? '-',
  },
  {
    key: 'totalOrders',
    header: '판매(건)',
    headerStyle: styles.colCount,
    cellStyle: styles.colCount,
    render: (expert) => expert.totalOrders,
  },
  {
    key: 'reportCount',
    header: '신고',
    headerStyle: styles.colReport,
    cellStyle: styles.colReport,
    render: (expert) => renderReportCount(expert.reportCount),
  },
  {
    key: 'createdAt',
    header: '가입일',
    headerStyle: styles.colDate,
    cellStyle: styles.colDate,
    render: (expert) => formatDate(expert.createdAt),
  },
];

interface Props {
  tab: UserTabType;
  items: (AdminUser | AdminExpert)[];
  page: number;
  pageSize: number;
}

export default function UserTable({ tab, items, page, pageSize }: Props) {
  if (tab === 'CLIENT') {
    return (
      <AdminTable
        cols={CLIENT_COLS}
        items={items as AdminUser[]}
        getKey={(item) => item.id}
        getHref={(item) => `/users/${item.id}`}
        page={page}
        pageSize={pageSize}
      />
    );
  }

  return (
    <AdminTable
      cols={EXPERT_COLS}
      items={items as AdminExpert[]}
      getKey={(item) => item.id}
      getHref={(item) => `/users/${item.id}`}
      page={page}
      pageSize={pageSize}
    />
  );
}
