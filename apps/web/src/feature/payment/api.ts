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
