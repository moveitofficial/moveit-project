'use client';

import { typography } from '@repo/styles/typography';
import { formatDate, formatPrice } from '@repo/utils';
import { useState } from 'react';

import * as styles from './ServiceTable.css';

import type { ColDef } from '@/components/common/AdminTable';
import type { ServiceItem } from '@/features/services/types';

import { AdminTable } from '@/components/common/AdminTable';
import { ServiceOrdersModal } from '@/components/common/modal/ServiceOrdersModal';
import { SERVICE_STATUS_LABEL, SERVICE_TYPE_LABEL } from '@/utils/constants';

function renderStatus(status: ServiceItem['status']) {
  const label = SERVICE_STATUS_LABEL[status];

  if (status === 'CLOSED') {
    return <span className={styles.statusDeleted}>{label}</span>;
  }

  return label;
}

function createCols(
  onTitleClick: (item: ServiceItem) => void,
): ColDef<ServiceItem>[] {
  return [
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
      render: (item) => (
        <button
          type="button"
          className={`${typography.f16R} ${styles.titleButton}`}
          onClick={() => {
            onTitleClick(item);
          }}
        >
          <span className={styles.titleText}>{item.title}</span>
        </button>
      ),
    },
    {
      key: 'categoryGroup',
      header: '카테고리',
      headerStyle: styles.colCategory,
      cellStyle: styles.colCategory,
      render: (item) => SERVICE_TYPE_LABEL[item.categoryGroup],
    },
    {
      key: 'businessName',
      header: '회사명',
      headerStyle: styles.colName,
      cellStyle: styles.colName,
      render: (item) => item.businessName ?? '-',
    },
    {
      key: 'status',
      header: '상태',
      headerStyle: styles.colStatus,
      cellStyle: styles.colStatus,
      render: (item) => renderStatus(item.status),
    },
    {
      key: 'servicePrice',
      header: '판매금액',
      headerStyle: styles.colPrice,
      cellStyle: styles.colPrice,
      render: (item) => formatPrice(item.servicePrice),
    },
    {
      key: 'createdAt',
      header: '등록일',
      headerStyle: styles.colDate,
      cellStyle: styles.colDate,
      render: (item) => formatDate(item.createdAt),
    },
    {
      key: 'orderCount',
      header: '판매 건수',
      headerStyle: styles.colSalesCount,
      cellStyle: styles.colSalesCount,
      render: (item) => `${item.orderCount}건`,
    },
  ];
}

interface Props {
  items: ServiceItem[];
  page: number;
  pageSize: number;
}

export default function ServiceTable({ items, page, pageSize }: Props) {
  const [serviceId, setServiceId] = useState<string | null>(null);

  const cols = createCols((item) => {
    setServiceId(item.id);
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
      {serviceId !== null && (
        <ServiceOrdersModal
          serviceId={serviceId}
          isOpen
          onClose={() => {
            setServiceId(null);
          }}
        />
      )}
    </>
  );
}
