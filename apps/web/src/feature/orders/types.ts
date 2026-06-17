export type OrderStatus =
  | 'NEGOTIATING'
  | 'CANCEL_REQUESTED'
  | 'PAYMENT_CANCELLED'
  | 'IN_PROGRESS'
  | 'DEADLINE_IMMINENT'
  | 'EXPIRED'
  | 'WORK_COMPLETED'
  | 'PURCHASE_CONFIRMED'
  | 'SETTLEMENT_REQUESTED'
  | 'SETTLEMENT_COMPLETED'
  | 'REFUND_REQUESTED'
  | 'REFUND_COMPLETED';

// GET /users/me/orders 쿼리·필터 파라미터
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

// GET /users/me/orders 목록 아이템
export interface OrderItem {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  startDate: string;
  endDate: string | null;
  createdAt: string;
  chatRoomId: string | null;
  service: {
    id: string;
    title: string;
    images: { imgUrl: string }[];
  };
  clientUser: {
    id: string;
    name: string | null;
  };
  expertUser: {
    id: string;
    businessName: string | null;
    profileImageUrl: string | null;
  };
  reviewId: string | null;
}

// GET /users/me/orders/summary?as=client|expert 응답
export interface OrderSummaryCounts {
  inProgress: number;
  purchaseConfirmPending: number;
  reviewable?: number; // client
  refund?: number; // client
  newOrder?: number; // expert
  deadlineImminent?: number; // expert
}

// GET /users/me/orders/counts?as=client|expert 응답
export interface OrderTabCounts {
  all: number;
  working: number;
  workCompleted: number;
  purchaseConfirmed: number;
  expired: number;
  cancelRefund: number;
  deadlineImminent?: number;
  settlement?: number;
}

// GET /users/me/orders/:orderId/payment 공통 필드
interface OrderPaymentBase {
  orderStatus: OrderStatus;
  method: string;
  installmentMonths: number;
  approvedAt: string;
  refundAmount: number | null;
}

// GET /users/me/orders/:orderId/payment — as=client
export interface ClientOrderPaymentResponse extends OrderPaymentBase {
  agreedServicePrice: number;
  platformFee: number;
  totalAmount: number | null;
}

// GET /users/me/orders/:orderId/payment — as=expert
export interface ExpertOrderPaymentResponse extends OrderPaymentBase {
  agreedServicePrice: number | null;
  settlementAmount: number | null;
}

export type OrderPaymentResponse =
  | ClientOrderPaymentResponse
  | ExpertOrderPaymentResponse;

export interface OrderTransaction {
  paidAt: string;
  method: string;
  installmentMonths: number;
  servicePrice: number;
  platformFee: number;
  totalAmount: number;
  settlementAmount: number;
  refundAmount: number | null;
  orderStatus: OrderStatus;
}

export interface ReviewData {
  id: string;
  rating: number;
  content: string;
}
