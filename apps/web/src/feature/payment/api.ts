import { api } from '@repo/fetcher';

import type { ApiSuccess } from '@/mocks/types';

export interface ConfirmOrderParams {
  serviceId: string;
  orderId: string;
  paymentKey: string;
  amount: number;
}

// 결제창 통과 후 백엔드에 주문을 확정한다. 서버가 금액을 재계산해 검증한다.
export async function confirmOrder(params: ConfirmOrderParams): Promise<void> {
  await api.post<ApiSuccess<unknown>>('/orders', params);
}

export interface PayOrderParams {
  paymentKey: string;
  amount: number;
  roomId?: string;
}

// 채팅 거래요청으로 이미 생성된 PENDING 주문을 결제 확정한다.
// roomId를 주면 백엔드가 PAYMENT_COMPLETED 시스템 메시지를 발송한다.
export async function payOrder(
  orderId: string,
  params: PayOrderParams,
): Promise<void> {
  await api.post<ApiSuccess<unknown>>(`/orders/${orderId}/pay`, params);
}
