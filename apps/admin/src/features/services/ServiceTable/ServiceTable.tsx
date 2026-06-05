import { formatDate, formatPrice } from '@repo/utils';

import * as styles from './ServiceTable.css';

import type { ColDef } from '@/components/common/AdminTable';
import type { AdminService } from '@/mocks/types';

import { AdminTable } from '@/components/common/AdminTable';
import { SERVICE_STATUS_LABEL, SERVICE_TYPE_LABEL } from '@/utils/constants';

function renderStatus(status: AdminService['status']) {
  const label = SERVICE_STATUS_LABEL[status];

  if (status === 'CLOSED') {
    return <span className={styles.statusDeleted}>{label}</span>;
  }

  return label;
}

const COLS: ColDef<AdminService>[] = [
  {
    key: 'no',
    header: '번호',
    headerStyle: styles.colNo,
    cellStyle: styles.colNo,
    render: (_, n) => n,
  },
  {
    key: 'title',
    header: '서비스명',
    headerStyle: styles.colTitleHeader,
    cellStyle: styles.colTitle,
    render: (item) => <span className={styles.titleText}>{item.title}</span>,
  },
  {
    key: 'serviceType',
    header: '카테고리',
    headerStyle: styles.colCategory,
    cellStyle: styles.colCategory,
    render: (item) => SERVICE_TYPE_LABEL[item.serviceType],
  },
  {
    key: 'expertName',
    header: '회사명',
    headerStyle: styles.colName,
    cellStyle: styles.colName,
    render: (item) => item.expertName,
  },
  {
    key: 'status',
    header: '상태',
    headerStyle: styles.colStatus,
    cellStyle: styles.colStatus,
    render: (item) => renderStatus(item.status),
  },
  {
    key: 'price',
    header: '판매금액',
    headerStyle: styles.colPrice,
    cellStyle: styles.colPrice,
    render: (item) => formatPrice(item.price),
  },
  {
    key: 'createdAt',
    header: '등록일',
    headerStyle: styles.colDate,
    cellStyle: styles.colDate,
    render: (item) => formatDate(item.createdAt),
  },
  {
    key: 'reviewCount',
    header: '판매 건수',
    headerStyle: styles.colSalesCount,
    cellStyle: styles.colSalesCount,
    render: (item) => `${item.reviewCount}건`,
  },
];

interface Props {
  items: AdminService[];
  page: number;
  pageSize: number;
}

export default function ServiceTable({ items, page, pageSize }: Props) {
  return (
    <AdminTable
      cols={COLS}
      items={items}
      getKey={(item) => item.id}
      page={page}
      pageSize={pageSize}
    />
  );
}
