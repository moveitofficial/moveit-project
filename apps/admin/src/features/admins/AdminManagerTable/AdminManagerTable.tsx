import { formatDate, formatRelativeTime } from '@repo/utils';

import * as styles from './AdminManagerTable.css';

import type { ColDef } from '@/components/common/AdminTable';
import type { AdminManager } from '@/mocks/types';

import { AdminTable } from '@/components/common/AdminTable';

const COLS: ColDef<AdminManager>[] = [
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
    key: 'lastLoginAt',
    header: '마지막 로그인',
    headerStyle: styles.colDate,
    cellStyle: styles.colDate,
    render: (item) =>
      item.lastLoginAt === null ? '-' : formatRelativeTime(item.lastLoginAt),
  },
  {
    key: 'createdAt',
    header: '등록일',
    headerStyle: styles.colLastDate,
    cellStyle: styles.colLastDate,
    render: (item) => formatDate(item.createdAt),
  },
];

interface Props {
  items: AdminManager[];
  page: number;
  pageSize: number;
}

export default function AdminManagerTable({ items, page, pageSize }: Props) {
  return (
    <AdminTable
      cols={COLS}
      items={items}
      getKey={(item) => item.id}
      getHref={(item) => `/admins/${item.id}`}
      page={page}
      pageSize={pageSize}
    />
  );
}
