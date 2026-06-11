import { isRecord } from '../common/utils/is-record.util';

import type { OrderPaymentData } from './payments.types';

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

export function mapOrderPayment(payment: OrderPaymentData) {
  return {
    id: payment.id,
    status: payment.status,
    method: payment.method,
    paidAmount: payment.paidAmount,
    installmentMonths: payment.installmentMonths,
    paymentKey: payment.paymentKey,
    createdAt: payment.createdAt,
    approvedAt: payment.approvedAt,
    card: extractPaymentCard(payment.rawData),
    receiptUrl: extractPaymentReceiptUrl(payment.rawData),
    refund: payment.refund === null ? null : mapOrderRefund(payment.refund),
  };
}
