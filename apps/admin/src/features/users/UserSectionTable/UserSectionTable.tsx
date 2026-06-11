'use client';

import emptyImage from '@public/empty.svg';
import { typography } from '@repo/styles/typography';
import Image from 'next/image';
import { useState } from 'react';

import {
  createCommentCols,
  createOrderCols,
  createPostCols,
  createReportReceivedCols,
  createReportSentCols,
  createServiceCols,
} from './sectionCols';
import * as styles from './UserSectionTable.css';

import type { ColDef } from '@/components/common/AdminTable';
import type {
  UserCommentItem,
  UserOrderItem,
  UserPostItem,
  UserReportReceivedItem,
  UserReportSentItem,
  UserServiceItem,
} from '@/features/users/types';
import type { RefundStatus } from '@/utils/constants';

import { AdminTable } from '@/components/common/AdminTable';
import { OrderActionModal } from '@/components/common/modal/OrderActionModal';
import { ReportDetailModal } from '@/components/common/modal/ReportDetailModal';
import { ServiceOrdersModal } from '@/components/common/modal/ServiceOrdersModal';
import { CommunityDeletionModal } from '@/features/users/CommunityDeletionModal';
import { isRefundStatus } from '@/utils/constants';

interface BaseProps<T extends { id: string }> {
  title: string;
  emptyMessage: string;
  items: T[];
}

type OrdersProps = BaseProps<UserOrderItem> & { variant: 'orders' };
type ServicesProps = BaseProps<UserServiceItem> & { variant: 'services' };
type ReportsReceivedProps = BaseProps<UserReportReceivedItem> & {
  variant: 'reportsReceived';
};
type ReportsSentProps = BaseProps<UserReportSentItem> & {
  variant: 'reportsSent';
};
type PostsProps = BaseProps<UserPostItem> & {
  variant: 'posts';
  userId: string;
};
type CommentsProps = BaseProps<UserCommentItem> & {
  variant: 'comments';
  userId: string;
};

type Props =
  | OrdersProps
  | ServicesProps
  | ReportsReceivedProps
  | ReportsSentProps
  | PostsProps
  | CommentsProps;

function TableContent<T extends { id: string }>({
  title,
  emptyMessage,
  cols,
  items,
}: {
  title: string;
  emptyMessage: string;
  cols: ColDef<T>[];
  items: T[];
}) {
  return (
    <section className={styles.section}>
      <h2 className={`${typography.f18EB} ${styles.title}`}>{title}</h2>
      <div className={styles.tableContainer}>
        <AdminTable
          cols={cols}
          items={items}
          getKey={(item) => item.id}
          page={1}
          pageSize={10}
          fillHeight
          emptyContent={
            <>
              <Image src={emptyImage} alt="" width={320} height={168} />
              <p className={`${typography.f18EB} ${styles.emptyText}`}>
                {emptyMessage}
              </p>
            </>
          }
        />
      </div>
    </section>
  );
}

export default function UserSectionTable(props: Props) {
  const [refundModal, setRefundModal] = useState<{
    orderId: string;
    refundStatus: RefundStatus;
  } | null>(null);

  const [communityModal, setCommunityModal] = useState<{
    contentType: 'post' | 'comment';
    contentId: string;
    mode: 'delete' | 'reason';
  } | null>(null);

  const [reportModal, setReportModal] = useState<{
    reportId: string;
    tableVariant: 'reportsReceived' | 'reportsSent';
  } | null>(null);

  const [serviceOrdersModal, setServiceOrdersModal] = useState<{
    serviceId: string;
  } | null>(null);

  const { title, emptyMessage } = props;

  if (props.variant === 'orders') {
    const cols = createOrderCols({
      onRefundClick: (item) => {
        if (item.refund !== null && isRefundStatus(item.refund)) {
          setRefundModal({ orderId: item.id, refundStatus: item.refund });
        }
      },
    });

    return (
      <>
        <TableContent
          title={title}
          emptyMessage={emptyMessage}
          cols={cols}
          items={props.items}
        />
        {refundModal !== null && (
          <OrderActionModal
            orderId={refundModal.orderId}
            type="refund"
            refundStatus={refundModal.refundStatus}
            isOpen
            onClose={() => {
              setRefundModal(null);
            }}
          />
        )}
      </>
    );
  }

  if (props.variant === 'services') {
    const cols = createServiceCols({
      onTitleClick: (item) => {
        setServiceOrdersModal({ serviceId: item.id });
      },
    });

    return (
      <>
        <TableContent
          title={title}
          emptyMessage={emptyMessage}
          cols={cols}
          items={props.items}
        />
        {serviceOrdersModal !== null && (
          <ServiceOrdersModal
            serviceId={serviceOrdersModal.serviceId}
            isOpen
            onClose={() => {
              setServiceOrdersModal(null);
            }}
          />
        )}
      </>
    );
  }

  if (props.variant === 'reportsReceived') {
    const cols = createReportReceivedCols({
      onDetailClick: (item) => {
        setReportModal({ reportId: item.id, tableVariant: 'reportsReceived' });
      },
    });

    return (
      <>
        <TableContent
          title={title}
          emptyMessage={emptyMessage}
          cols={cols}
          items={props.items}
        />
        {reportModal !== null && (
          <ReportDetailModal
            reportId={reportModal.reportId}
            tableVariant={reportModal.tableVariant}
            isOpen
            onClose={() => {
              setReportModal(null);
            }}
          />
        )}
      </>
    );
  }

  if (props.variant === 'reportsSent') {
    const cols = createReportSentCols({
      onDetailClick: (item) => {
        setReportModal({ reportId: item.id, tableVariant: 'reportsSent' });
      },
    });

    return (
      <>
        <TableContent
          title={title}
          emptyMessage={emptyMessage}
          cols={cols}
          items={props.items}
        />
        {reportModal !== null && (
          <ReportDetailModal
            reportId={reportModal.reportId}
            tableVariant={reportModal.tableVariant}
            isOpen
            onClose={() => {
              setReportModal(null);
            }}
          />
        )}
      </>
    );
  }

  if (props.variant === 'posts') {
    const cols = createPostCols({
      onDeleteClick: (item) => {
        setCommunityModal({
          contentType: 'post',
          contentId: item.id,
          mode: 'delete',
        });
      },
      onReasonClick: (item) => {
        setCommunityModal({
          contentType: 'post',
          contentId: item.id,
          mode: 'reason',
        });
      },
    });

    return (
      <>
        <TableContent
          title={title}
          emptyMessage={emptyMessage}
          cols={cols}
          items={props.items}
        />
        {communityModal !== null && (
          <CommunityDeletionModal
            userId={props.userId}
            contentType={communityModal.contentType}
            contentId={communityModal.contentId}
            mode={communityModal.mode}
            isOpen
            onClose={() => {
              setCommunityModal(null);
            }}
          />
        )}
      </>
    );
  }

  const cols = createCommentCols({
    onDeleteClick: (item) => {
      setCommunityModal({
        contentType: 'comment',
        contentId: item.id,
        mode: 'delete',
      });
    },
    onReasonClick: (item) => {
      setCommunityModal({
        contentType: 'comment',
        contentId: item.id,
        mode: 'reason',
      });
    },
  });

  return (
    <>
      <TableContent
        title={title}
        emptyMessage={emptyMessage}
        cols={cols}
        items={props.items}
      />
      {communityModal !== null && (
        <CommunityDeletionModal
          userId={props.userId}
          contentType={communityModal.contentType}
          contentId={communityModal.contentId}
          mode={communityModal.mode}
          isOpen
          onClose={() => {
            setCommunityModal(null);
          }}
        />
      )}
    </>
  );
}
