import type { OrderTabKey } from './types';
import type { OrderStatus } from '@/types/enums';

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
