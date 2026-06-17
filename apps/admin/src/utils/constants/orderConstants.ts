import type { OrderStatus } from '@/types/enums';
import type { OrderCardAction } from '@repo/ui/OrderCard';
import type { RectLabelColor } from '@repo/ui/RectLabel';

export const REFUND_STATUS = [
  'CANCEL_REQUESTED',
  'REFUND_REQUESTED',
  'CANCEL_COMPLETED',
  'REFUND_COMPLETED',
] as const;

export type RefundStatus = (typeof REFUND_STATUS)[number];

export function isRefundStatus(refund: string): refund is RefundStatus {
  return (REFUND_STATUS as readonly string[]).includes(refund);
}

export function isRefundStatusApproval(refund: string): boolean {
  return refund === 'CANCEL_REQUESTED' || refund === 'REFUND_REQUESTED';
}

interface BadgeConfig {
  text: string;
  color: RectLabelColor;
}

export const ORDER_STATUS_BADGE_CONFIG: Record<OrderStatus, BadgeConfig> = {
  PENDING: { text: '결제대기', color: 'yellow' },
  TRADE_REQUEST_EXPIRED: { text: '요청만료', color: 'red' },
  NEGOTIATING: { text: '논의중', color: 'blue50' },
  IN_PROGRESS: { text: '작업중', color: 'blue50' },
  DEADLINE_IMMINENT: { text: '마감임박', color: 'yellow' },
  WORK_COMPLETED: { text: '작업완료', color: 'yellow' },
  PURCHASE_CONFIRMED: { text: '구매확정', color: 'blue400' },
  SETTLEMENT_REQUESTED: { text: '정산요청', color: 'yellow' },
  SETTLEMENT_COMPLETED: { text: '정산완료', color: 'blue400' },
  EXPIRED: { text: '기한만료', color: 'red' },
  REFUND_REQUESTED: { text: '환불요청', color: 'red' },
  REFUND_COMPLETED: { text: '환불완료', color: 'blue400' },
  CANCEL_REQUESTED: { text: '취소요청', color: 'red' },
  PAYMENT_CANCELLED: { text: '취소완료', color: 'blue400' },
};

const DETAIL_ACTION: OrderCardAction = { label: '거래상세', variant: 'white' };

export type NestedOrderModal =
  | { type: 'transaction'; orderId: string }
  | { type: 'settlement'; orderId: string }
  | { type: 'settlementApprove'; orderId: string }
  | { type: 'refund'; orderId: string; refundStatus: RefundStatus };

type ModalTemplate =
  | { type: 'transaction' }
  | { type: 'settlement' }
  | { type: 'settlementApprove' }
  | { type: 'refund'; refundStatus: RefundStatus };

const LABEL_TO_MODAL: Record<string, ModalTemplate> = {
  거래상세: { type: 'transaction' },
  정산상세: { type: 'settlement' },
  정산승인: { type: 'settlementApprove' },
  취소승인: { type: 'refund', refundStatus: 'CANCEL_REQUESTED' },
  환불승인: { type: 'refund', refundStatus: 'REFUND_REQUESTED' },
  취소상세: { type: 'refund', refundStatus: 'CANCEL_COMPLETED' },
  환불상세: { type: 'refund', refundStatus: 'REFUND_COMPLETED' },
};

export function getNestedModalFromLabel(
  label: string,
  orderId: string,
): NestedOrderModal | null {
  const template = LABEL_TO_MODAL[label];
  if (template === undefined) return null;
  return { ...template, orderId };
}

export const ORDER_STATUS_ACTIONS_CONFIG: Record<
  OrderStatus,
  OrderCardAction[]
> = {
  PENDING: [DETAIL_ACTION],
  TRADE_REQUEST_EXPIRED: [DETAIL_ACTION],
  NEGOTIATING: [DETAIL_ACTION],
  IN_PROGRESS: [DETAIL_ACTION],
  DEADLINE_IMMINENT: [DETAIL_ACTION],
  WORK_COMPLETED: [DETAIL_ACTION],
  PURCHASE_CONFIRMED: [DETAIL_ACTION],
  SETTLEMENT_REQUESTED: [DETAIL_ACTION, { label: '정산승인', variant: 'blue' }],
  SETTLEMENT_COMPLETED: [
    DETAIL_ACTION,
    { label: '정산상세', variant: 'white' },
  ],
  EXPIRED: [DETAIL_ACTION],
  REFUND_REQUESTED: [DETAIL_ACTION, { label: '환불승인', variant: 'red' }],
  REFUND_COMPLETED: [DETAIL_ACTION, { label: '환불상세', variant: 'white' }],
  CANCEL_REQUESTED: [DETAIL_ACTION, { label: '취소승인', variant: 'red' }],
  PAYMENT_CANCELLED: [DETAIL_ACTION, { label: '취소상세', variant: 'white' }],
};
