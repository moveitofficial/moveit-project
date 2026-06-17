import { OrderStatus, PaymentStatus } from '@prisma/client';

export const DEADLINE_IMMINENT_DAYS = 3;
export const PENDING_EXPIRY_DAYS = 3;
export const MS_PER_DAY = 24 * 60 * 60 * 1000;

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

// 마이페이지 탭별 카운트 그룹 — 요청 상태는 직전 상태에 합치고, 환불·취소 탭은 완료분만
// 전문가: 마감임박 탭 없음 → DEADLINE_IMMINENT를 작업/논의중에 포함
const ORDER_TAB_STATUSES_EXPERT = {
  working: [
    OrderStatus.NEGOTIATING,
    OrderStatus.IN_PROGRESS,
    OrderStatus.DEADLINE_IMMINENT,
    OrderStatus.CANCEL_REQUESTED,
  ],
  workCompleted: [OrderStatus.WORK_COMPLETED],
  purchaseConfirmed: [OrderStatus.PURCHASE_CONFIRMED],
  settlement: [
    OrderStatus.SETTLEMENT_REQUESTED,
    OrderStatus.SETTLEMENT_COMPLETED,
  ],
  expired: [OrderStatus.EXPIRED, OrderStatus.REFUND_REQUESTED],
  cancelRefund: [OrderStatus.PAYMENT_CANCELLED, OrderStatus.REFUND_COMPLETED],
} satisfies Record<string, OrderStatus[]>;

// 의뢰인: 정산 탭 없음 → SETTLEMENT를 구매확정에 포함
const ORDER_TAB_STATUSES_CLIENT = {
  working: [
    OrderStatus.NEGOTIATING,
    OrderStatus.IN_PROGRESS,
    OrderStatus.CANCEL_REQUESTED,
  ],
  workCompleted: [OrderStatus.WORK_COMPLETED],
  purchaseConfirmed: [
    OrderStatus.PURCHASE_CONFIRMED,
    OrderStatus.SETTLEMENT_REQUESTED,
    OrderStatus.SETTLEMENT_COMPLETED,
  ],
  deadlineImminent: [OrderStatus.DEADLINE_IMMINENT],
  expired: [OrderStatus.EXPIRED, OrderStatus.REFUND_REQUESTED],
  cancelRefund: [OrderStatus.PAYMENT_CANCELLED, OrderStatus.REFUND_COMPLETED],
} satisfies Record<string, OrderStatus[]>;

export const ORDER_TAB_STATUSES = {
  [ORDER_LIST_AS.CLIENT]: ORDER_TAB_STATUSES_CLIENT,
  [ORDER_LIST_AS.EXPERT]: ORDER_TAB_STATUSES_EXPERT,
} as const;

// 일정관리 탭별 카운트 — client·expert 공통 (전체 = 아래 4개 상태 합)
export const SCHEDULE_TAB_STATUSES = {
  inProgress: [OrderStatus.IN_PROGRESS],
  workCompleted: [OrderStatus.WORK_COMPLETED],
  deadlineImminent: [OrderStatus.DEADLINE_IMMINENT],
  expired: [OrderStatus.EXPIRED],
} satisfies Record<string, OrderStatus[]>;

export const SCHEDULE_LIST_STATUSES: OrderStatus[] = [
  OrderStatus.IN_PROGRESS,
  OrderStatus.WORK_COMPLETED,
  OrderStatus.DEADLINE_IMMINENT,
  OrderStatus.EXPIRED,
];

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
