import { formatDate } from '@repo/utils';

import * as styles from './WithdrawnTable.css';

import type { ColDef } from '@/components/common/AdminTable';
import type { WithdrawnItem } from '@/features/withdrawn/types';

import { AdminTable } from '@/components/common/AdminTable';
import { ReasonModalTrigger } from '@/features/withdrawn/ReasonModalTrigger';
import { PROVIDER_LABEL } from '@/utils/constants';

const COLS: ColDef<WithdrawnItem>[] = [
  {
    key: 'no',
    header: '번호',
    headerStyle: styles.colNo,
    cellStyle: styles.colNo,
    render: (_, n) => n,
  },
  {
    key: 'email',
    header: '이메일',
    headerStyle: styles.colEmailHeader,
    cellStyle: styles.colEmail,
    render: (item) => <span className={styles.emailText}>{item.email}</span>,
  },
  {
    key: 'deletionReason',
    header: '탈퇴 사유',
    headerStyle: styles.colReasonHeader,
    cellStyle: styles.colReason,
    render: (item) => (
      <ReasonModalTrigger reason={item.deletionReason ?? '-'} />
    ),
  },
  {
    key: 'provider',
    header: '가입경로',
    headerStyle: styles.colProvider,
    cellStyle: styles.colProvider,
    render: (item) => PROVIDER_LABEL[item.provider],
  },
  {
    key: 'createdAt',
    header: '가입일',
    headerStyle: styles.colDate,
    cellStyle: styles.colDate,
    render: (item) => formatDate(item.createdAt),
  },
  {
    key: 'deletedAt',
    header: '탈퇴일',
    headerStyle: styles.colWithdrawnDate,
    cellStyle: styles.colWithdrawnDate,
    render: (item) => formatDate(item.deletedAt),
  },
];

interface Props {
  items: WithdrawnItem[];
  page: number;
  pageSize: number;
}

export default function WithdrawnTable({ items, page, pageSize }: Props) {
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
