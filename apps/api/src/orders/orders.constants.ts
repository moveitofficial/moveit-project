// 플랫폼 수수료율 (10%)
export const PLATFORM_FEE_RATE = 0.1;

//주문 생성(미결제(PENDING) 상태) 초기 금액
export const INITIAL_PAID_AMOUNT = 0;

// PG 연동 전 임시 값 -> 교체예정
export const PG_STUB_PROVIDER = 'TOSS' as const;
export const PG_STUB_RECEIPT_URL = 'http://...' as const;

// 결제 검증 실패 시 Payment.rawData에 사유 기록
export const PAYMENT_AMOUNT_VALIDATION_FAILED_REASON =
  'PAYMENT_AMOUNT_VALIDATION_FAILED' as const;
