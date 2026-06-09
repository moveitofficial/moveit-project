import type { OrderTabKey } from './types';
import type { OrderStatus } from '@/types/enums';
import type { OrderCardAction } from '@repo/ui/OrderCard';
import type { RectLabelColor } from '@repo/ui/RectLabel';

interface BadgeConfig {
  text: string;
  color: RectLabelColor;
}

export const ORDER_STATUS_BADGE_CONFIG: Record<OrderStatus, BadgeConfig> = {
  NEGOTIATING: { text: '논의중', color: 'blue50' },
  IN_PROGRESS: { text: '작업중', color: 'blue50' },
  DEADLINE_IMMINENT: { text: '마감임박', color: 'yellow' },
  WORK_COMPLETED: { text: '작업완료', color: 'yellow' },
  PURCHASE_CONFIRMED: { text: '구매확정', color: 'blue400' },
  SETTLEMENT_REQUESTED: { text: '정산요청', color: 'yellow' },
  SETTLEMENT_COMPLETED: { text: '정산완료', color: 'blue400' },
  EXPIRED: { text: '기한만료', color: 'red' },
  REFUND_REQUESTED: { text: '환불요청', color: 'red' },
  REFUND_COMPLETED: { text: '환불완료', color: 'red' },
  CANCEL_REQUESTED: { text: '취소요청', color: 'red' },
  PAYMENT_CANCELLED: { text: '결제취소', color: 'red' },
};

const DETAIL_ACTION: OrderCardAction = { label: '거래상세', variant: 'white' };

export const ORDER_STATUS_ACTIONS_CONFIG: Record<
  OrderStatus,
  OrderCardAction[]
> = {
  NEGOTIATING: [DETAIL_ACTION],
  IN_PROGRESS: [DETAIL_ACTION],
  DEADLINE_IMMINENT: [DETAIL_ACTION],
  WORK_COMPLETED: [DETAIL_ACTION],
  PURCHASE_CONFIRMED: [DETAIL_ACTION],
  SETTLEMENT_REQUESTED: [DETAIL_ACTION],
  SETTLEMENT_COMPLETED: [DETAIL_ACTION, { label: '정산상세', variant: 'white' }],
  EXPIRED: [DETAIL_ACTION],
  REFUND_REQUESTED: [DETAIL_ACTION, { label: '환불승인', variant: 'red' }],
  REFUND_COMPLETED: [DETAIL_ACTION, { label: '환불상세', variant: 'blue' }],
  CANCEL_REQUESTED: [DETAIL_ACTION, { label: '취소승인', variant: 'blue' }],
  PAYMENT_CANCELLED: [DETAIL_ACTION],
};

export interface OrderTabConfig {
  key: OrderTabKey | null;
  label: string;
  statuses: OrderStatus[];
}

export const ORDER_TABS: OrderTabConfig[] = [
  { key: null, label: '전체', statuses: [] },
  {
    key: 'working',
    label: '작업/논의중',
    statuses: ['NEGOTIATING', 'IN_PROGRESS'],
  },
  { key: 'workCompleted', label: '작업완료', statuses: ['WORK_COMPLETED'] },
  {
    key: 'purchaseConfirmed',
    label: '구매확정',
    statuses: ['PURCHASE_CONFIRMED'],
  },
  {
    key: 'settlement',
    label: '정산요청/완료',
    statuses: ['SETTLEMENT_REQUESTED', 'SETTLEMENT_COMPLETED'],
  },
  { key: 'expired', label: '기한만료', statuses: ['EXPIRED'] },
  {
    key: 'deadlineImminent',
    label: '마감임박',
    statuses: ['DEADLINE_IMMINENT'],
  },
  {
    key: 'cancelRefund',
    label: '환불·취소',
    statuses: [
      'REFUND_REQUESTED',
      'REFUND_COMPLETED',
      'CANCEL_REQUESTED',
      'PAYMENT_CANCELLED',
    ],
  },
];
