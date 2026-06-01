import { OrderStatus, Role } from '@prisma/client';

import { ORDER_ERRORS } from '../common/constants/errors';
import { AppException } from '../common/exceptions/app.exception';

import type {
  OrderPolicyOrder,
  OrderSchedulePolicyOrder,
} from './orders.types';

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.NEGOTIATING]: [OrderStatus.CANCEL_REQUESTED],
  [OrderStatus.CANCEL_REQUESTED]: [OrderStatus.PAYMENT_CANCELLED],
  [OrderStatus.PAYMENT_CANCELLED]: [],
  [OrderStatus.IN_PROGRESS]: [OrderStatus.WORK_COMPLETED],
  // DEADLINE_IMMINENT·EXPIRED → target 전환은 크론 전용 (PATCH 불가)
  [OrderStatus.DEADLINE_IMMINENT]: [OrderStatus.WORK_COMPLETED],
  [OrderStatus.EXPIRED]: [],
  [OrderStatus.WORK_COMPLETED]: [],
  [OrderStatus.PURCHASE_CONFIRMED]: [],
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
  order: OrderPolicyOrder,
  next: OrderStatus,
  userId: string,
  userRole: Role,
): void {
  if (order.clientUserId !== userId && order.expertUserId !== userId) {
    throw new AppException(ORDER_ERRORS.FORBIDDEN_NOT_OWNER);
  }

  if (next === OrderStatus.CANCEL_REQUESTED && order.clientUserId !== userId) {
    throw new AppException(ORDER_ERRORS.FORBIDDEN_NOT_OWNER);
  }

  if (
    next === OrderStatus.PAYMENT_CANCELLED &&
    (order.expertUserId !== userId || userRole !== Role.EXPERT)
  ) {
    throw new AppException(ORDER_ERRORS.FORBIDDEN_NOT_OWNER);
  }

  if (
    next === OrderStatus.WORK_COMPLETED &&
    (order.expertUserId !== userId || userRole !== Role.EXPERT)
  ) {
    throw new AppException(ORDER_ERRORS.FORBIDDEN_NOT_OWNER);
  }
}

export function validateConfirmOrderPolicy(
  order: OrderPolicyOrder,
  userId: string,
): void {
  if (order.clientUserId !== userId) {
    throw new AppException(ORDER_ERRORS.FORBIDDEN_NOT_OWNER);
  }
  if (order.status !== OrderStatus.WORK_COMPLETED) {
    throw new AppException(ORDER_ERRORS.INVALID_STATUS);
  }
}

export function validateSettlementRequestPolicy(
  order: OrderPolicyOrder,
  userId: string,
): void {
  if (order.expertUserId !== userId) {
    throw new AppException(ORDER_ERRORS.FORBIDDEN_NOT_OWNER);
  }
  if (order.status !== OrderStatus.PURCHASE_CONFIRMED) {
    throw new AppException(ORDER_ERRORS.INVALID_STATUS);
  }
}

export function validateScheduleAuthority(
  order: OrderSchedulePolicyOrder,
  userId: string,
  userRole: Role,
): void {
  if (order.clientUserId !== userId && order.expertUserId !== userId) {
    throw new AppException(ORDER_ERRORS.FORBIDDEN_NOT_OWNER);
  }

  if (order.status === OrderStatus.NEGOTIATING && order.endDate === null) {
    if (order.expertUserId !== userId || userRole !== Role.EXPERT) {
      throw new AppException(ORDER_ERRORS.FORBIDDEN_NOT_OWNER);
    }
    return;
  }

  if (
    order.status === OrderStatus.IN_PROGRESS ||
    order.status === OrderStatus.DEADLINE_IMMINENT
  ) {
    if (order.clientUserId !== userId || userRole !== Role.CLIENT) {
      throw new AppException(ORDER_ERRORS.FORBIDDEN_NOT_OWNER);
    }
    return;
  }

  throw new AppException(ORDER_ERRORS.INVALID_STATUS);
}
