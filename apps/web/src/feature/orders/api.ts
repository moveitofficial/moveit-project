import { api } from '@repo/fetcher';

import { TAB_STATUS_MAP_BY_ROLE } from './constants';

import type {
  ClientOrderPaymentResponse,
  OrderItem,
  OrderPaymentResponse,
  OrderSortKey,
  OrderSummaryCounts,
  OrderTabCounts,
  OrderTabKey,
  OrderTransaction,
  ReviewData,
} from './types';
import type { ApiSuccess, PaginatedResult } from '@/types/api';
import type { Role } from '@/types/enums';

export interface GetOrdersParams {
  tab?: OrderTabKey;
  sort?: OrderSortKey;
  search?: string;
  page: number;
  role?: Role;
}

export function getOrders(
  params: GetOrdersParams,
): Promise<ApiSuccess<PaginatedResult<OrderItem>>> {
  const query = new URLSearchParams({ page: String(params.page) });

  if (params.role !== undefined) {
    query.set('as', params.role.toLowerCase());
  }
  if (params.tab !== undefined) {
    const statuses =
      TAB_STATUS_MAP_BY_ROLE[params.role ?? 'CLIENT'][params.tab];
    if (statuses.length > 0) {
      query.set('status', statuses.join(','));
    }
  }
  if (params.sort !== undefined) {
    query.set('sort', params.sort);
  }
  if (params.search !== undefined) {
    query.set('search', params.search);
  }

  return api.get<ApiSuccess<PaginatedResult<OrderItem>>>(
    `/users/me/orders?${query.toString()}`,
  );
}

function isClientOrderPayment(
  order: OrderPaymentResponse,
): order is ClientOrderPaymentResponse {
  return 'platformFee' in order;
}

export async function getOrderTransaction(
  orderId: string,
): Promise<ApiSuccess<OrderTransaction>> {
  const response = await api.get<ApiSuccess<OrderPaymentResponse>>(
    `/users/me/orders/${orderId}/payment`,
  );
  const order = response.data;

  const transaction: OrderTransaction = {
    paidAt: order.approvedAt,
    method: order.method,
    card: order.card,
    installmentMonths: order.installmentMonths,
    servicePrice: order.agreedServicePrice ?? 0,
    platformFee: isClientOrderPayment(order) ? order.platformFee : 0,
    totalAmount: isClientOrderPayment(order) ? (order.totalAmount ?? 0) : 0,
    settlementAmount: isClientOrderPayment(order)
      ? 0
      : (order.settlementAmount ?? 0),
    refundAmount: order.refundAmount,
    orderStatus: order.orderStatus,
  };

  return { success: true, message: response.message, data: transaction };
}

export function getOrderSummary(
  role: Role,
): Promise<ApiSuccess<OrderSummaryCounts>> {
  return api.get<ApiSuccess<OrderSummaryCounts>>(
    `/users/me/orders/summary?as=${role.toLowerCase()}`,
  );
}

export function getOrderTabCounts(
  role: Role,
): Promise<ApiSuccess<OrderTabCounts>> {
  return api.get<ApiSuccess<OrderTabCounts>>(
    `/users/me/orders/counts?as=${role.toLowerCase()}`,
  );
}

export function getOrderReview(
  orderId: string,
): Promise<ApiSuccess<ReviewData>> {
  return api.get<ApiSuccess<ReviewData>>(`/orders/${orderId}/reviews`);
}
