import { OrderStatus, Role } from '@prisma/client';

import { ORDER_ERRORS } from '../common/constants/errors';
import { AppException } from '../common/exceptions/app.exception';

import type { OrderWithPayment } from './orders.types';

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.NEGOTIATING]: [
    OrderStatus.IN_PROGRESS,
    OrderStatus.CANCEL_REQUESTED,
  ],
  [OrderStatus.CANCEL_REQUESTED]: [],
  [OrderStatus.PAYMENT_CANCELLED]: [],
  [OrderStatus.IN_PROGRESS]: [OrderStatus.WORK_COMPLETED],
  [OrderStatus.DEADLINE_IMMINENT]: [],
  [OrderStatus.EXPIRED]: [],
  [OrderStatus.WORK_COMPLETED]: [OrderStatus.PURCHASE_CONFIRMED],
  [OrderStatus.PURCHASE_CONFIRMED]: [OrderStatus.SETTLEMENT_REQUESTED],
  [OrderStatus.SETTLEMENT_REQUESTED]: [],
  [OrderStatus.SETTLEMENT_COMPLETED]: [],
  [OrderStatus.REFUND_REQUESTED]: [],
  [OrderStatus.REFUND_COMPLETED]: [],
};

export function validateOrderStatusFlow(
  current: OrderStatus,
  next: OrderStatus,
): void {
  if (
    current === OrderStatus.SETTLEMENT_COMPLETED ||
    current === OrderStatus.REFUND_COMPLETED
  ) {
    throw new AppException(ORDER_ERRORS.ALREADY_PROCESSED);
  }

  if (!ALLOWED_TRANSITIONS[current].includes(next)) {
    throw new AppException(ORDER_ERRORS.INVALID_STATUS);
  }
}

export function validateOrderStatusAuthority(
  order: OrderWithPayment,
  next: OrderStatus,
  userId: string,
  userRole: Role,
): void {
  if (order.clientUserId !== userId && order.expertUserId !== userId) {
    throw new AppException(ORDER_ERRORS.FORBIDDEN_NOT_OWNER);
  }

  if (next === OrderStatus.IN_PROGRESS && order.clientUserId !== userId) {
    throw new AppException(ORDER_ERRORS.FORBIDDEN_NOT_OWNER);
  }

  if (next === OrderStatus.CANCEL_REQUESTED && order.clientUserId !== userId) {
    throw new AppException(ORDER_ERRORS.FORBIDDEN_NOT_OWNER);
  }

  if (
    next === OrderStatus.WORK_COMPLETED &&
    (order.expertUserId !== userId || userRole !== Role.EXPERT)
  ) {
    throw new AppException(ORDER_ERRORS.FORBIDDEN_NOT_OWNER);
  }

  if (
    next === OrderStatus.PURCHASE_CONFIRMED &&
    (order.clientUserId !== userId || userRole !== Role.CLIENT)
  ) {
    throw new AppException(ORDER_ERRORS.FORBIDDEN_NOT_OWNER);
  }

  if (
    next === OrderStatus.SETTLEMENT_REQUESTED &&
    (order.expertUserId !== userId || userRole !== Role.EXPERT)
  ) {
    throw new AppException(ORDER_ERRORS.FORBIDDEN_NOT_OWNER);
  }
}
