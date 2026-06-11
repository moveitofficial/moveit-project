import { PaymentStatus } from '@prisma/client';

// 목록 노출 대상 — PENDING·FAILED(레거시) 제외
export const LISTABLE_PAYMENT_STATUSES: PaymentStatus[] = [
  PaymentStatus.PAID,
  PaymentStatus.CANCELLED,
  PaymentStatus.REFUNDED,
];

// GET /users/me/orders 목록 — 페이지네이션 기본값
export const ORDERS_LIST_DEFAULT_PAGE = 1;
export const ORDERS_LIST_DEFAULT_PAGE_SIZE = 20;

// GET /users/me/orders 목록 — as 값
export const ORDER_LIST_AS = {
  CLIENT: 'client',
  EXPERT: 'expert',
} as const;

export type OrderListAs = (typeof ORDER_LIST_AS)[keyof typeof ORDER_LIST_AS];

export const ORDER_LIST_USER_ID_FIELD = {
  [ORDER_LIST_AS.CLIENT]: 'clientUserId',
  [ORDER_LIST_AS.EXPERT]: 'expertUserId',
} as const;

// GET /users/me/orders 목록 — 정렬
export const ORDER_LIST_SORT = ['latest', 'deadline'] as const;

export type OrderListSort = (typeof ORDER_LIST_SORT)[number];

export const ORDER_LIST_DEFAULT_SORT: OrderListSort = 'latest';

// 목록 메인 이미지 조회 개수
export const ORDER_LIST_MAIN_IMAGE_LIMIT = 1;

// 플랫폼 수수료율 (10%)
export const PLATFORM_FEE_RATE = 0.1;

export function calculatePlatformFee(servicePrice: number): number {
  return Math.floor(servicePrice * PLATFORM_FEE_RATE);
}

export function calculateTotalAmount(servicePrice: number): number {
  return servicePrice + calculatePlatformFee(servicePrice);
}

export const DEFAULT_PAYMENT_METHOD = 'CARD' as const;
