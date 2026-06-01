import type { OrderPaymentData } from './payments.types';

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
    refund: payment.refund,
  };
}
