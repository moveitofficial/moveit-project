import { formatDate } from '@repo/utils';

import * as styles from './WithdrawnTable.css';

import type { ColDef } from '@/components/common/AdminTable';
import type { AdminWithdrawnExpert, AdminWithdrawnUser } from '@/mocks/types';

import { AdminTable } from '@/components/common/AdminTable';
import { ReasonModalTrigger } from '@/features/withdrawn/ReasonModalTrigger';
import { PROVIDER_LABEL } from '@/utils/constants';

type WithdrawnItem = AdminWithdrawnUser | AdminWithdrawnExpert;

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
    key: 'withdrawReason',
    header: '탈퇴 사유',
    headerStyle: styles.colReasonHeader,
    cellStyle: styles.colReason,
    render: (item) => (
      <ReasonModalTrigger reason={item.withdrawReason} />
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
    key: 'withdrawnAt',
    header: '탈퇴일',
    headerStyle: styles.colWithdrawnDate,
    cellStyle: styles.colWithdrawnDate,
    render: (item) => formatDate(item.withdrawnAt),
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
