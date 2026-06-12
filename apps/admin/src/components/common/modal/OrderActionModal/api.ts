import { api } from '@repo/fetcher';

import type {
  OrderRefundDetail,
  OrderSettlement,
  OrderSettlementPreview,
  OrderTransaction,
} from './types';
import type { ApiSuccess } from '@/types/api';

export function getOrderTransaction(
  orderId: string,
): Promise<ApiSuccess<OrderTransaction>> {
  return api.get<ApiSuccess<OrderTransaction>>(
    `/admin/orders/${orderId}/transaction`,
  );
}

export function getOrderRefund(
  orderId: string,
): Promise<ApiSuccess<OrderRefundDetail>> {
  return api.get<ApiSuccess<OrderRefundDetail>>(
    `/admin/orders/${orderId}/refund`,
  );
}

export function getOrderSettlement(
  orderId: string,
): Promise<ApiSuccess<OrderSettlement>> {
  return api.get<ApiSuccess<OrderSettlement>>(
    `/admin/orders/${orderId}/settlement`,
  );
}

export function getOrderSettlementPreview(
  orderId: string,
): Promise<ApiSuccess<OrderSettlementPreview>> {
  return api.get<ApiSuccess<OrderSettlementPreview>>(
    `/admin/orders/${orderId}/settlement/preview`,
  );
}
