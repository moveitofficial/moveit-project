import { formatDate, formatPrice } from '@repo/utils';

import * as styles from './sectionCols.css';

import type { ColDef } from '@/components/common/AdminTable';
import type {
  UserCommentItem,
  UserOrderItem,
  UserPostItem,
  UserReportReceivedItem,
  UserReportSentItem,
  UserServiceItem,
} from '@/features/users/types';
import type { ReportReason } from '@/types/enums';

import {
  SERVICE_STATUS_LABEL,
  ORDER_STATUS_LABEL,
  REFUND_KIND_LABEL,
  REPORT_REASON_LABEL,
  COMMUNITY_STATUS_LABEL,
  isRefundStatus,
  isRefundStatusApproval,
} from '@/utils/constants';

// 주문
interface OrderColOptions {
  onRefundClick?: (item: UserOrderItem) => void;
}

function orderStatusStyle(status: string) {
  if (status === 'DEADLINE_IMMINENT' || status === 'EXPIRED') {
    return styles.orderStatusUrgent;
  }
  return null;
}

function renderRefundCell(
  item: UserOrderItem,
  onRefundClick?: (item: UserOrderItem) => void,
) {
  if (item.refund === null) {
    return '-';
  }

  const label = REFUND_KIND_LABEL[item.refund] ?? item.refund;

  if (onRefundClick !== undefined && isRefundStatus(item.refund)) {
    return (
      <button
        type="button"
        className={
          isRefundStatusApproval(item.refund)
            ? styles.refundRequestClickable
            : styles.refundClickable
        }
        onClick={() => {
          onRefundClick(item);
        }}
      >
        {label}
      </button>
    );
  }

  if (isRefundStatusApproval(item.refund)) {
    return <span className={styles.refundRequestText}>{label}</span>;
  }

  return label;
}

const BASE_ORDER_COLS: ColDef<UserOrderItem>[] = [
  {
    key: 'no',
    header: '번호',
    headerStyle: styles.colOrderNo,
    cellStyle: styles.colOrderNo,
    render: (_, n) => n,
  },
  {
    key: 'service',
    header: '서비스명',
    headerStyle: styles.colFlexHeader,
    cellStyle: styles.colOrderService,
    render: (item) => (
      <span className={styles.truncate}>{item.service.title}</span>
    ),
  },
  {
    key: 'expert',
    header: '판매자명',
    headerStyle: styles.colOrderExpert,
    cellStyle: styles.colOrderExpert,
    render: (item) => item.expert.name ?? '-',
  },
  {
    key: 'status',
    header: '상태',
    headerStyle: styles.colOrderStatus,
    cellStyle: styles.colOrderStatus,
    render: (item) => {
      const label =
        (ORDER_STATUS_LABEL as Record<string, string | undefined>)[
          item.status
        ] ?? item.status;
      const statusClass = orderStatusStyle(item.status);

      if (statusClass !== null) {
        return <span className={statusClass}>{label}</span>;
      }

      return label;
    },
  },
  {
    key: 'totalAmount',
    header: '결제금액',
    headerStyle: styles.colOrderAmount,
    cellStyle: styles.colOrderAmount,
    render: (item) => formatPrice(item.totalAmount),
  },
  {
    key: 'platformFee',
    header: '수수료',
    headerStyle: styles.colOrderFee,
    cellStyle: styles.colOrderFee,
    render: (item) => formatPrice(item.platformFee),
  },
  {
    key: 'endDate',
    header: '마감일',
    headerStyle: styles.colOrderEndDate,
    cellStyle: styles.colOrderEndDate,
    render: (item) => (item.endDate === null ? '-' : formatDate(item.endDate)),
  },
  {
    key: 'refund',
    header: '취소/환불',
    headerStyle: styles.colOrderRefund,
    cellStyle: styles.colOrderRefund,
    render: (item) => renderRefundCell(item),
  },
];

export function createOrderCols(
  options?: OrderColOptions,
): ColDef<UserOrderItem>[] {
  if (options?.onRefundClick === undefined) {
    return BASE_ORDER_COLS;
  }

  return BASE_ORDER_COLS.map((col) =>
    col.key === 'refund'
      ? {
          ...col,
          render: (item) => renderRefundCell(item, options.onRefundClick),
        }
      : col,
  );
}

// 서비스
export const SERVICE_COLS: ColDef<UserServiceItem>[] = [
  {
    key: 'no',
    header: '번호',
    headerStyle: styles.colServiceNo,
    cellStyle: styles.colServiceNo,
    render: (_, n) => n,
  },
  {
    key: 'title',
    header: '서비스명',
    headerStyle: styles.colFlexHeader,
    cellStyle: styles.colServiceTitle,
    render: (item) => <span className={styles.truncate}>{item.title}</span>,
  },
  {
    key: 'status',
    header: '상태',
    headerStyle: styles.colServiceStatus,
    cellStyle: styles.colServiceStatus,
    render: (item) =>
      (SERVICE_STATUS_LABEL as Record<string, string | undefined>)[
        item.status
      ] ?? item.status,
  },
  {
    key: 'servicePrice',
    header: '판매금액',
    headerStyle: styles.colServicePrice,
    cellStyle: styles.colServicePrice,
    render: (item) => formatPrice(item.servicePrice),
  },
  {
    key: 'createdAt',
    header: '등록일',
    headerStyle: styles.colServiceCreatedAt,
    cellStyle: styles.colServiceCreatedAt,
    render: (item) => formatDate(item.createdAt),
  },
  {
    key: 'salesCount',
    header: '판매 건수',
    headerStyle: styles.colServiceSalesCount,
    cellStyle: styles.colServiceSalesCount,
    render: (item) => item.salesCount,
  },
];

export function createServiceCols(options?: {
  onTitleClick?: (item: UserServiceItem) => void;
}): ColDef<UserServiceItem>[] {
  if (options?.onTitleClick === undefined) {
    return SERVICE_COLS;
  }

  return SERVICE_COLS.map((col) =>
    col.key === 'title'
      ? {
          ...col,
          render: (item) => (
            <button
              type="button"
              className={styles.serviceTitleButton}
              onClick={() => {
                options.onTitleClick?.(item);
              }}
            >
              <span className={styles.truncate}>{item.title}</span>
            </button>
          ),
        }
      : col,
  );
}

// 신고
interface BaseReportFields {
  detail: string;
  reason: ReportReason;
  createdAt: string;
}

interface ReportColOptions<T extends BaseReportFields & { id: string }> {
  onDetailClick?: (item: T) => void;
}

function makeReportCols<T extends BaseReportFields & { id: string }>(
  userColKey: string,
  userColHeader: string,
  getUser: (item: T) => string,
  options?: ReportColOptions<T>,
): ColDef<T>[] {
  return [
    {
      key: 'no',
      header: '번호',
      headerStyle: styles.colReportNo,
      cellStyle: styles.colReportNo,
      render: (_, n) => n,
    },
    {
      key: userColKey,
      header: userColHeader,
      headerStyle: styles.colReportUser,
      cellStyle: styles.colReportUser,
      render: (item) => getUser(item),
    },
    {
      key: 'detail',
      header: '상세 내용',
      headerStyle: styles.colFlexHeader,
      cellStyle: styles.colReportDetail,
      render: (item) => (
        <button
          type="button"
          className={styles.reportDetailButton}
          onClick={() => {
            options?.onDetailClick?.(item);
          }}
        >
          <span className={styles.truncate}>{item.detail}</span>
        </button>
      ),
    },
    {
      key: 'reason',
      header: '사유',
      headerStyle: styles.colReportReason,
      cellStyle: styles.colReportReason,
      render: (item) => REPORT_REASON_LABEL[item.reason],
    },
    {
      key: 'createdAt',
      header: '신고받은날',
      headerStyle: styles.colReportDate,
      cellStyle: styles.colReportDate,
      render: (item) => formatDate(item.createdAt),
    },
  ];
}

export function createReportReceivedCols(
  options?: ReportColOptions<UserReportReceivedItem>,
): ColDef<UserReportReceivedItem>[] {
  return makeReportCols<UserReportReceivedItem>(
    'reporter',
    '신고한 유저',
    (item) => item.reporter.name ?? '-',
    options,
  );
}

export function createReportSentCols(
  options?: ReportColOptions<UserReportSentItem>,
): ColDef<UserReportSentItem>[] {
  return makeReportCols<UserReportSentItem>(
    'reported',
    '신고 대상',
    (item) => item.reported.name ?? '-',
    options,
  );
}

// 커뮤니티 (게시글 · 댓글)
interface CommunityDeleteColOptions<
  T extends { id: string; status: UserPostItem['status'] },
> {
  onDeleteClick?: (item: T) => void;
  onReasonClick?: (item: T) => void;
}

interface BaseCommunityFields {
  status: UserPostItem['status'];
  createdAt: string;
  deletedAt: string | null;
}

function communityStatusStyle(status: UserPostItem['status']) {
  if (status === 'ADMIN_DELETED') {
    return styles.statusAdminDeleted;
  }
  if (status === 'USER_DELETED') {
    return styles.statusDeleted;
  }

  return styles.statusVisible;
}

function renderCommunityDeleteCell<
  T extends { id: string; status: UserPostItem['status'] },
>(item: T, options?: CommunityDeleteColOptions<T>) {
  if (item.status === 'VISIBLE') {
    return (
      <button
        type="button"
        className={styles.deleteAction}
        onClick={() => {
          options?.onDeleteClick?.(item);
        }}
      >
        관리자 삭제
      </button>
    );
  }

  if (item.status === 'ADMIN_DELETED') {
    return (
      <button
        type="button"
        className={styles.deleteReasonLink}
        onClick={() => {
          options?.onReasonClick?.(item);
        }}
      >
        삭제 사유 보기
      </button>
    );
  }

  return '-';
}

function makeCommunityCol<T extends BaseCommunityFields & { id: string }>(
  contentKey: string,
  contentHeader: string,
  getContent: (item: T) => string,
  options?: CommunityDeleteColOptions<T>,
): ColDef<T>[] {
  return [
    {
      key: 'no',
      header: '번호',
      headerStyle: styles.colCommunityNo,
      cellStyle: styles.colCommunityNo,
      render: (_, n) => n,
    },
    {
      key: contentKey,
      header: contentHeader,
      headerStyle: styles.colFlexHeader,
      cellStyle: styles.colCommunityContent,
      render: (item) => (
        <span className={styles.truncate}>{getContent(item)}</span>
      ),
    },
    {
      key: 'status',
      header: '상태',
      headerStyle: styles.colCommunityStatus,
      cellStyle: styles.colCommunityStatus,
      render: (item) => (
        <span className={communityStatusStyle(item.status)}>
          {COMMUNITY_STATUS_LABEL[item.status]}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: '작성일',
      headerStyle: styles.colCommunityCreatedAt,
      cellStyle: styles.colCommunityCreatedAt,
      render: (item) => formatDate(item.createdAt),
    },
    {
      key: 'deletedAt',
      header: '관리자 삭제일',
      headerStyle: styles.colCommunityDeletedAt,
      cellStyle: styles.colCommunityDeletedAt,
      render: (item) =>
        item.deletedAt === null ? '-' : formatDate(item.deletedAt),
    },
    {
      key: 'delete',
      header: '삭제',
      headerStyle: styles.colCommunityDelete,
      cellStyle: styles.colCommunityDelete,
      render: (item) => renderCommunityDeleteCell(item, options),
    },
  ];
}

const BASE_POST_COLS = makeCommunityCol<UserPostItem>(
  'title',
  '제목',
  (item) => item.title,
);

const BASE_COMMENT_COLS = makeCommunityCol<UserCommentItem>(
  'content',
  '댓글 내용',
  (item) => item.content,
);

export function createPostCols(
  options?: CommunityDeleteColOptions<UserPostItem>,
): ColDef<UserPostItem>[] {
  if (
    options?.onDeleteClick === undefined &&
    options?.onReasonClick === undefined
  ) {
    return BASE_POST_COLS;
  }

  return makeCommunityCol<UserPostItem>(
    'title',
    '제목',
    (item) => item.title,
    options,
  );
}

export function createCommentCols(
  options?: CommunityDeleteColOptions<UserCommentItem>,
): ColDef<UserCommentItem>[] {
  if (
    options?.onDeleteClick === undefined &&
    options?.onReasonClick === undefined
  ) {
    return BASE_COMMENT_COLS;
  }

  return makeCommunityCol<UserCommentItem>(
    'content',
    '댓글 내용',
    (item) => item.content,
    options,
  );
}
