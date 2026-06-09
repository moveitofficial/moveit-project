import type { ServiceCategory, ServiceType } from '@/types/enums';
import type { OrderStatus } from '@/types/enums';

export const ORDER_TAB_KEYS = [
  'working',
  'workCompleted',
  'purchaseConfirmed',
  'settlement',
  'expired',
  'deadlineImminent',
  'cancelRefund',
] as const;

export type OrderTabKey = (typeof ORDER_TAB_KEYS)[number];

export const ORDER_SORT_KEYS = ['latest', 'deadline'] as const;

export type OrderSortKey = (typeof ORDER_SORT_KEYS)[number];

export interface OrderFilterParams {
  tab?: OrderTabKey;
  sort?: OrderSortKey;
  search?: string;
}

export function isOrderTab(v: string): v is OrderTabKey {
  return (ORDER_TAB_KEYS as readonly string[]).includes(v);
}

export function isOrderSort(v: string): v is OrderSortKey {
  return (ORDER_SORT_KEYS as readonly string[]).includes(v);
}

export interface OrderItem {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  startDate: string;
  endDate: string | null;
  client: {
    id: string;
    name: string | null;
  };
  expert: {
    id: string;
    businessName: string | null;
  };
  service: {
    id: string;
    title: string;
    thumbnailUrl: string | null;
    categoryGroup: ServiceType;
    categoryName: ServiceCategory;
  };
}

export interface OrderCounts {
  all: number;
  working: number;
  workCompleted: number;
  purchaseConfirmed: number;
  settlement: number;
  expired: number;
  deadlineImminent: number;
  cancelRefund: number;
}
