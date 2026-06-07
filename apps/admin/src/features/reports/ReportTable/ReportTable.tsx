import { formatDate } from '@repo/utils';

import * as styles from './ReportTable.css';

import type { ColDef } from '@/components/common/AdminTable';
import type { ReportItem } from '@/features/reports/types';

import { AdminTable } from '@/components/common/AdminTable';
import { REPORT_REASON_LABEL } from '@/utils/constants';

const COLS: ColDef<ReportItem>[] = [
  {
    key: 'no',
    header: '번호',
    headerStyle: styles.colNo,
    cellStyle: styles.colNo,
    render: (_, n) => n,
  },
  {
    key: 'reporter',
    header: '신고한 유저',
    headerStyle: styles.colUser,
    cellStyle: styles.colUserText,
    render: (item) => item.reporter.name ?? '-',
  },
  {
    key: 'reported',
    header: '신고 대상',
    headerStyle: styles.colUser,
    cellStyle: styles.colUserText,
    render: (item) => item.reported.name ?? '-',
  },
  {
    key: 'detail',
    header: '상세 내용',
    headerStyle: styles.colDetailHeader,
    cellStyle: styles.colDetail,
    render: (item) => <span className={styles.detailText}>{item.detail}</span>,
  },
  {
    key: 'reason',
    header: '사유',
    headerStyle: styles.colReason,
    cellStyle: styles.colReason,
    render: (item) => REPORT_REASON_LABEL[item.reason],
  },
  {
    key: 'createdAt',
    header: '신고날짜',
    headerStyle: styles.colDate,
    cellStyle: styles.colDate,
    render: (item) => formatDate(item.createdAt),
  },
];

interface Props {
  items: ReportItem[];
  page: number;
  pageSize: number;
}

export default function ReportTable({ items, page, pageSize }: Props) {
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
