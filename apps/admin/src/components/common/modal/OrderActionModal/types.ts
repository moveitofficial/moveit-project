export interface OrderTransaction {
  paidAt: string;
  method: string;
  installmentMonths: number;
  servicePrice: number;
  platformFee: number;
  totalAmount: number;
}

export interface OrderRefundDetail {
  paidAt: string;
  method: string;
  installmentMonths: number;
  servicePrice: number;
  refundAmount: number;
  type: 'REFUND' | 'CANCEL';
  approvedAt: string;
  approvedBy: {
    type: 'ADMIN' | 'EXPERT';
    name: string | null;
    reason: string | null;
  };
}

export interface OrderSettlement {
  paidAt: string;
  method: string;
  installmentMonths: number;
  servicePrice: number;
  platformFee: number;
  settlementAmount: number;
  settledAt: string;
  settledByAdminName: string | null;
}

export interface OrderSettlementPreview {
  businessName: string | null;
  bankName: string | null;
  bankAccount: string | null;
  settlementAmount: number;
}
