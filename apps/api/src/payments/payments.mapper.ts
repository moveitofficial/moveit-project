import { OrderStatus } from '@prisma/client';

import { isRecord } from '../common/utils/is-record.util';

import type { OrderPaymentData, OrderPaymentOrder } from './payments.types';

const REFUNDED_STATUSES: ReadonlySet<OrderStatus> = new Set<OrderStatus>([
  OrderStatus.PAYMENT_CANCELLED,
  OrderStatus.REFUND_COMPLETED,
]);

type OrderRefundData = NonNullable<OrderPaymentData['refund']>;

export interface PaymentCardData {
  number: string;
  cardType: string;
  issuerCode: string;
  approveNo: string;
}

export function extractPaymentCard(rawData: unknown): PaymentCardData | null {
  if (!isRecord(rawData)) return null;
  const card = rawData.card;
  if (!isRecord(card)) return null;
  if (
    typeof card.number !== 'string' ||
    typeof card.cardType !== 'string' ||
    typeof card.issuerCode !== 'string' ||
    typeof card.approveNo !== 'string'
  ) {
    return null;
  }
  return {
    number: card.number,
    cardType: card.cardType,
    issuerCode: card.issuerCode,
    approveNo: card.approveNo,
  };
}

export function extractPaymentReceiptUrl(rawData: unknown): string | null {
  if (!isRecord(rawData)) return null;
  const receipt = rawData.receipt;
  if (!isRecord(receipt)) return null;
  if (typeof receipt.url !== 'string') return null;
  return receipt.url;
}

function mapOrderRefund(refund: OrderRefundData) {
  return {
    id: refund.id,
    type: refund.type,
    status: refund.status,
    refundAmount: refund.refundAmount,
    adminReason: refund.adminReason,
    requestedAt: refund.requestedAt,
    approvedAt: refund.approvedAt,
    refundedAt: refund.refundedAt,
  };
}

function mapPaymentBase(order: OrderPaymentOrder) {
  const { payment } = order;
  return {
    orderStatus: order.status,
    paymentId: payment.id,
    paymentStatus: payment.status,
    method: payment.method,
    installmentMonths: payment.installmentMonths,
    paymentKey: payment.paymentKey,
    approvedAt: payment.approvedAt,
    card: extractPaymentCard(payment.rawData),
    receiptUrl: extractPaymentReceiptUrl(payment.rawData),
    refund: payment.refund === null ? null : mapOrderRefund(payment.refund),
  };
}

export function mapOrderPaymentForClient(order: OrderPaymentOrder) {
  const isRefunded = REFUNDED_STATUSES.has(order.status);
  return {
    ...mapPaymentBase(order),
    agreedServicePrice: order.agreedServicePrice,
    platformFee: order.platformFee,
    totalAmount: isRefunded ? null : order.totalAmount,
    refundAmount: isRefunded
      ? (order.payment.refund?.refundAmount ?? null)
      : null,
  };
}

export function mapOrderPaymentForExpert(order: OrderPaymentOrder) {
  const isRefunded = REFUNDED_STATUSES.has(order.status);
  const refundAmountForExpert =
    order.payment.refund === null
      ? null
      : order.payment.refund.refundAmount - order.platformFee;
  return {
    ...mapPaymentBase(order),
    agreedServicePrice: isRefunded ? null : order.agreedServicePrice,
    settlementAmount: isRefunded ? null : order.agreedServicePrice,
    refundAmount: isRefunded ? refundAmountForExpert : null,
  };
}
