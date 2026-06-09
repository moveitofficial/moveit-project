import { OrderStatus } from '@prisma/client';

export const ORDER_TABS = [
  'all',
  'working',
  'workCompleted',
  'purchaseConfirmed',
  'settlement',
  'expired',
  'deadlineImminent',
  'cancelRefund',
] as const;

export type OrderTab = (typeof ORDER_TABS)[number];

export const ORDER_TAB_STATUSES: Record<
  Exclude<OrderTab, 'all'>,
  OrderStatus[]
> = {
  working: [OrderStatus.NEGOTIATING, OrderStatus.IN_PROGRESS],
  workCompleted: [OrderStatus.WORK_COMPLETED],
  purchaseConfirmed: [OrderStatus.PURCHASE_CONFIRMED],
  settlement: [
    OrderStatus.SETTLEMENT_REQUESTED,
    OrderStatus.SETTLEMENT_COMPLETED,
  ],
  expired: [OrderStatus.EXPIRED],
  deadlineImminent: [OrderStatus.DEADLINE_IMMINENT],
  cancelRefund: [
    OrderStatus.CANCEL_REQUESTED,
    OrderStatus.PAYMENT_CANCELLED,
    OrderStatus.REFUND_REQUESTED,
    OrderStatus.REFUND_COMPLETED,
  ],
};
