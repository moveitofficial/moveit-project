'use client';

import { typography } from '@repo/styles/typography';
import { formatDate } from '@repo/utils';
import Link from 'next/link';
import { useState } from 'react';

import * as styles from './ReportTable.css';

import type { ColDef } from '@/components/common/AdminTable';
import type { ReportItem } from '@/features/reports/types';

import { AdminTable } from '@/components/common/AdminTable';
import { ReportDetailModal } from '@/components/common/modal/ReportDetailModal';
import { REPORT_REASON_LABEL } from '@/utils/constants';

function createCols(
  onDetailClick: (item: ReportItem) => void,
): ColDef<ReportItem>[] {
  return [
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
      render: (item) => (
        <Link
          href={`/users/${item.reporter.id}`}
          className={`${typography.f16R} ${styles.userLink}`}
        >
          {item.reporter.name ?? '-'}
        </Link>
      ),
    },
    {
      key: 'reported',
      header: '신고 대상',
      headerStyle: styles.colUser,
      cellStyle: styles.colUserText,
      render: (item) => (
        <Link
          href={`/users/${item.reported.id}`}
          className={`${typography.f16R} ${styles.userLink}`}
        >
          {item.reported.name ?? '-'}
        </Link>
      ),
    },
    {
      key: 'detail',
      header: '상세 내용',
      headerStyle: styles.colDetailHeader,
      cellStyle: styles.colDetail,
      render: (item) => (
        <button
          type="button"
          className={`${typography.f16R} ${styles.detailButton}`}
          onClick={() => {
            onDetailClick(item);
          }}
        >
          {item.detail}
        </button>
      ),
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
}

interface Props {
  items: ReportItem[];
  page: number;
  pageSize: number;
}

export default function ReportTable({ items, page, pageSize }: Props) {
  const [reportId, setReportId] = useState<string | null>(null);

  const cols = createCols((item) => {
    setReportId(item.id);
  });

  return (
    <>
      <AdminTable
        cols={cols}
        items={items}
        getKey={(item) => item.id}
        page={page}
        pageSize={pageSize}
      />
      {reportId !== null && (
        <ReportDetailModal
          reportId={reportId}
          tableVariant="reportsReceived"
          isOpen
          onClose={() => {
            setReportId(null);
          }}
        />
      )}
    </>
  );
}
