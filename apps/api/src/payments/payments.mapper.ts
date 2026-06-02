import type { OrderPaymentData } from './payments.types';

type OrderRefundData = NonNullable<OrderPaymentData['refund']>;

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
    refund: payment.refund === null ? null : mapOrderRefund(payment.refund),
  };
}
