import type { OrderStatus, OrderSummaryCounts, OrderTabKey } from './types';
import type { Role } from '@/types/enums';
import type { OrderCardAction } from '@repo/ui/OrderCard';
import type { RectLabelColor } from '@repo/ui/RectLabel';

/** 탭 */
interface OrderTabConfig {
  key: OrderTabKey | null;
  label: string;
  statuses: OrderStatus[];
}

export const TAB_STATUS_MAP_BY_ROLE: Record<
  Role,
  Record<OrderTabKey, OrderStatus[]>
> = {
  CLIENT: {
    working: ['NEGOTIATING', 'IN_PROGRESS', 'CANCEL_REQUESTED'],
    workCompleted: ['WORK_COMPLETED'],
    purchaseConfirmed: [
      'PURCHASE_CONFIRMED',
      'SETTLEMENT_REQUESTED',
      'SETTLEMENT_COMPLETED',
    ],
    settlement: [],
    deadlineImminent: ['DEADLINE_IMMINENT'],
    expired: ['EXPIRED', 'REFUND_REQUESTED'],
    cancelRefund: ['PAYMENT_CANCELLED', 'REFUND_COMPLETED'],
  },
  EXPERT: {
    working: [
      'NEGOTIATING',
      'IN_PROGRESS',
      'DEADLINE_IMMINENT',
      'CANCEL_REQUESTED',
    ],
    workCompleted: ['WORK_COMPLETED'],
    purchaseConfirmed: ['PURCHASE_CONFIRMED'],
    settlement: ['SETTLEMENT_REQUESTED', 'SETTLEMENT_COMPLETED'],
    deadlineImminent: [],
    expired: ['EXPIRED', 'REFUND_REQUESTED'],
    cancelRefund: ['PAYMENT_CANCELLED', 'REFUND_COMPLETED'],
  },
};

const CLIENT_TAB_STATUS_MAP = TAB_STATUS_MAP_BY_ROLE.CLIENT;
const EXPERT_TAB_STATUS_MAP = TAB_STATUS_MAP_BY_ROLE.EXPERT;

const CLIENT_ORDER_TABS: OrderTabConfig[] = [
  { key: null, label: '전체', statuses: [] },
  {
    key: 'working',
    label: '작업/논의중',
    statuses: CLIENT_TAB_STATUS_MAP.working,
  },
  {
    key: 'workCompleted',
    label: '작업완료',
    statuses: CLIENT_TAB_STATUS_MAP.workCompleted,
  },
  {
    key: 'purchaseConfirmed',
    label: '구매확정',
    statuses: CLIENT_TAB_STATUS_MAP.purchaseConfirmed,
  },
  {
    key: 'deadlineImminent',
    label: '마감임박',
    statuses: CLIENT_TAB_STATUS_MAP.deadlineImminent,
  },
  {
    key: 'expired',
    label: '기한만료',
    statuses: CLIENT_TAB_STATUS_MAP.expired,
  },
  {
    key: 'cancelRefund',
    label: '환불·취소',
    statuses: CLIENT_TAB_STATUS_MAP.cancelRefund,
  },
];

const EXPERT_ORDER_TABS: OrderTabConfig[] = [
  { key: null, label: '전체', statuses: [] },
  {
    key: 'working',
    label: '작업/논의중',
    statuses: EXPERT_TAB_STATUS_MAP.working,
  },
  {
    key: 'workCompleted',
    label: '작업완료',
    statuses: EXPERT_TAB_STATUS_MAP.workCompleted,
  },
  {
    key: 'purchaseConfirmed',
    label: '구매확정',
    statuses: EXPERT_TAB_STATUS_MAP.purchaseConfirmed,
  },
  {
    key: 'settlement',
    label: '정산요청/완료',
    statuses: EXPERT_TAB_STATUS_MAP.settlement,
  },
  {
    key: 'expired',
    label: '기한만료',
    statuses: EXPERT_TAB_STATUS_MAP.expired,
  },
  {
    key: 'cancelRefund',
    label: '환불·취소',
    statuses: EXPERT_TAB_STATUS_MAP.cancelRefund,
  },
];

export const ORDER_TABS_BY_ROLE = {
  CLIENT: CLIENT_ORDER_TABS,
  EXPERT: EXPERT_ORDER_TABS,
} as const;

/** 요약 카드 */
export type SummaryCardColor = 'blue300' | 'yellow100' | 'black500' | 'red200';

interface SummaryCardConfig {
  label: string;
  colorKey: SummaryCardColor;
  countKey: keyof OrderSummaryCounts;
}

export const CLIENT_SUMMARY_CARDS: SummaryCardConfig[] = [
  { label: '작업중', colorKey: 'blue300', countKey: 'inProgress' },
  {
    label: '구매확정대기',
    colorKey: 'yellow100',
    countKey: 'purchaseConfirmPending',
  },
  { label: '리뷰 작성 가능', colorKey: 'black500', countKey: 'reviewable' },
  { label: '환불요청/완료', colorKey: 'red200', countKey: 'refund' },
];

export const EXPERT_SUMMARY_CARDS: SummaryCardConfig[] = [
  { label: '신규주문', colorKey: 'blue300', countKey: 'newOrder' },
  { label: '작업중', colorKey: 'yellow100', countKey: 'inProgress' },
  { label: '마감임박', colorKey: 'black500', countKey: 'deadlineImminent' },
  {
    label: '구매확정 대기',
    colorKey: 'red200',
    countKey: 'purchaseConfirmPending',
  },
];

/** 뱃지 */
interface BadgeConfig {
  text: string;
  color: RectLabelColor;
}

export const ORDER_STATUS_BADGE_CONFIG: Record<OrderStatus, BadgeConfig> = {
  NEGOTIATING: { text: '논의중', color: 'blue50' },
  IN_PROGRESS: { text: '작업중', color: 'blue50' },
  DEADLINE_IMMINENT: { text: '마감임박', color: 'yellow' },
  WORK_COMPLETED: { text: '작업완료', color: 'yellow' },
  PURCHASE_CONFIRMED: { text: '구매확정 완료', color: 'blue400' },
  SETTLEMENT_REQUESTED: { text: '정산요청', color: 'yellow' },
  SETTLEMENT_COMPLETED: { text: '정산완료', color: 'blue400' },
  EXPIRED: { text: '기한만료', color: 'red' },
  REFUND_REQUESTED: { text: '환불요청', color: 'red' },
  REFUND_COMPLETED: { text: '환불완료', color: 'blue400' },
  CANCEL_REQUESTED: { text: '취소요청', color: 'red' },
  PAYMENT_CANCELLED: { text: '취소완료', color: 'blue400' },
};

/** 액션·모달  */
export type NestedOrderModal =
  | { type: 'transaction'; orderId: string }
  | { type: 'requestCancel'; orderId: string }
  | { type: 'confirmPurchase'; orderId: string }
  | { type: 'confirmPurchaseCompleted'; orderId: string }
  | { type: 'requestRefund'; orderId: string }
  | { type: 'refundRequestCompleted' }
  | { type: 'cancelRefund'; orderId: string }
  | { type: 'refundRequestCancelled' }
  | { type: 'writeReview'; orderId: string }
  | { type: 'viewReview'; orderId: string; reviewId: string }
  | {
      type: 'editReview';
      orderId: string;
      reviewId: string;
      rating: number;
      content: string;
    }
  | { type: 'deleteReview'; orderId: string; reviewId: string }
  | { type: 'requestSettlement'; orderId: string }
  | { type: 'completeWork'; orderId: string }
  | { type: 'approveRefund'; orderId: string }
  | { type: 'rejectRefund'; orderId: string }
  | { type: 'approveCancel'; orderId: string }
  | { type: 'rejectCancel'; orderId: string };

type ModalTemplate =
  | { type: 'transaction' }
  | { type: 'requestCancel' }
  | { type: 'confirmPurchase' }
  | { type: 'writeReview' }
  | { type: 'requestSettlement' }
  | { type: 'completeWork' }
  | { type: 'approveRefund' }
  | { type: 'rejectRefund' }
  | { type: 'cancelRefund' }
  | { type: 'approveCancel' }
  | { type: 'rejectCancel' };

const LABEL_TO_MODAL: Record<string, ModalTemplate> = {
  거래상세: { type: 'transaction' },
  주문취소: { type: 'requestCancel' },
  구매확정: { type: 'confirmPurchase' },
  리뷰작성: { type: 'writeReview' },
  정산요청: { type: 'requestSettlement' },
  작업완료: { type: 'completeWork' },
  환불승인: { type: 'approveRefund' },
  환불거절: { type: 'rejectRefund' },
  환불취소: { type: 'cancelRefund' },
  취소승인: { type: 'approveCancel' },
  취소거절: { type: 'rejectCancel' },
};

export function getNestedModalFromLabel(
  label: string,
  orderId: string,
): NestedOrderModal | null {
  const template = LABEL_TO_MODAL[label];
  if (template === undefined) return null;
  return { ...template, orderId };
}

const CHAT_ACTION: OrderCardAction = { label: '채팅', variant: 'white' };
const DETAIL_ACTION: OrderCardAction = { label: '거래상세', variant: 'white' };

export const ORDER_STATUS_ACTIONS_CONFIG: Record<
  Role,
  Record<OrderStatus, OrderCardAction[]>
> = {
  CLIENT: {
    NEGOTIATING: [
      CHAT_ACTION,
      DETAIL_ACTION,
      { label: '주문취소', variant: 'white' },
    ],
    IN_PROGRESS: [CHAT_ACTION, DETAIL_ACTION],
    DEADLINE_IMMINENT: [CHAT_ACTION, DETAIL_ACTION],
    WORK_COMPLETED: [
      CHAT_ACTION,
      DETAIL_ACTION,
      { label: '구매확정', variant: 'blue' },
    ],
    PURCHASE_CONFIRMED: [
      DETAIL_ACTION,
      { label: '리뷰작성', variant: 'blue' },
      { label: '리뷰보기', variant: 'white' },
    ],
    SETTLEMENT_REQUESTED: [CHAT_ACTION, DETAIL_ACTION],
    SETTLEMENT_COMPLETED: [CHAT_ACTION, DETAIL_ACTION],
    EXPIRED: [
      CHAT_ACTION,
      DETAIL_ACTION,
      { label: '환불요청', variant: 'white' },
    ],
    CANCEL_REQUESTED: [CHAT_ACTION, DETAIL_ACTION],
    PAYMENT_CANCELLED: [CHAT_ACTION, DETAIL_ACTION],
    REFUND_REQUESTED: [
      CHAT_ACTION,
      DETAIL_ACTION,
      { label: '환불취소', variant: 'white' },
    ],
    REFUND_COMPLETED: [CHAT_ACTION, DETAIL_ACTION],
  },
  EXPERT: {
    NEGOTIATING: [
      CHAT_ACTION,
      DETAIL_ACTION,
      { label: '일정등록', variant: 'blue' },
    ],
    IN_PROGRESS: [
      CHAT_ACTION,
      DETAIL_ACTION,
      { label: '일정변경 요청', variant: 'white' },
      { label: '작업완료', variant: 'blue' },
    ],
    DEADLINE_IMMINENT: [
      CHAT_ACTION,
      DETAIL_ACTION,
      { label: '일정변경 요청', variant: 'white' },
      { label: '작업완료', variant: 'blue' },
    ],
    WORK_COMPLETED: [
      CHAT_ACTION,
      DETAIL_ACTION,
      { label: '구매확정 요청', variant: 'white' },
    ],
    PURCHASE_CONFIRMED: [
      CHAT_ACTION,
      DETAIL_ACTION,
      { label: '정산요청', variant: 'white' },
    ],
    SETTLEMENT_REQUESTED: [CHAT_ACTION, DETAIL_ACTION],
    SETTLEMENT_COMPLETED: [CHAT_ACTION, DETAIL_ACTION],
    EXPIRED: [
      CHAT_ACTION,
      DETAIL_ACTION,
      { label: '일정변경 요청', variant: 'white' },
      { label: '작업완료', variant: 'blue' },
    ],
    CANCEL_REQUESTED: [
      CHAT_ACTION,
      DETAIL_ACTION,
      { label: '취소승인', variant: 'red' },
    ],
    PAYMENT_CANCELLED: [CHAT_ACTION, DETAIL_ACTION],
    REFUND_REQUESTED: [
      CHAT_ACTION,
      DETAIL_ACTION,
      { label: '일정변경 요청', variant: 'white' },
      { label: '환불승인', variant: 'red' },
    ],
    REFUND_COMPLETED: [CHAT_ACTION, DETAIL_ACTION],
  },
};
