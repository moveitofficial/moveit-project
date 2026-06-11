import {
  OrderStatus,
  PaymentStatus,
  RefundStatus,
  RefundType,
  Role,
} from '@prisma/client';

import {
  ORDER_ERRORS,
  PAYMENT_ERRORS,
  REFUND_ERRORS,
} from '../common/constants/errors';
import { AppException } from '../common/exceptions/app.exception';

import type {
  OrderCancelApprovePolicyOrder,
  OrderCancelRequestPolicyOrder,
  OrderPolicyOrder,
  OrderSchedulePolicyOrder,
} from './orders.types';

const PATCH_BLOCKED_TARGETS = new Set<OrderStatus>([
  OrderStatus.CANCEL_REQUESTED,
  OrderStatus.PAYMENT_CANCELLED,
  OrderStatus.REFUND_REQUESTED,
  OrderStatus.REFUND_COMPLETED,
]);

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.NEGOTIATING]: [],
  [OrderStatus.CANCEL_REQUESTED]: [],
  [OrderStatus.PAYMENT_CANCELLED]: [],
  [OrderStatus.IN_PROGRESS]: [OrderStatus.WORK_COMPLETED],
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
  if (PATCH_BLOCKED_TARGETS.has(next)) {
    throw new AppException(ORDER_ERRORS.INVALID_STATUS);
  }

  if (order.clientUserId !== userId && order.expertUserId !== userId) {
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

export function validateCancelRequestPolicy(
  order: OrderCancelRequestPolicyOrder,
  userId: string,
): void {
  if (order.clientUserId !== userId) {
    throw new AppException(ORDER_ERRORS.FORBIDDEN_NOT_OWNER);
  }
  if (
    order.status === OrderStatus.CANCEL_REQUESTED ||
    order.status === OrderStatus.REFUND_REQUESTED
  ) {
    throw new AppException(REFUND_ERRORS.ALREADY_REQUESTED);
  }
  if (
    order.status === OrderStatus.PAYMENT_CANCELLED ||
    order.status === OrderStatus.REFUND_COMPLETED ||
    order.status === OrderStatus.SETTLEMENT_COMPLETED
  ) {
    throw new AppException(ORDER_ERRORS.ALREADY_PROCESSED);
  }
  if (order.status !== OrderStatus.NEGOTIATING) {
    throw new AppException(REFUND_ERRORS.CANCEL_NOT_ALLOWED);
  }
  if (order.payment?.status !== PaymentStatus.PAID) {
    throw new AppException(PAYMENT_ERRORS.NOT_FOUND);
  }
  const refund = order.payment.refund;
  if (refund !== null && refund.status !== RefundStatus.REJECTED) {
    throw new AppException(REFUND_ERRORS.ALREADY_REQUESTED);
  }
}

export function validateRefundRequestPolicy(
  order: OrderCancelRequestPolicyOrder,
  userId: string,
): void {
  if (order.clientUserId !== userId) {
    throw new AppException(ORDER_ERRORS.FORBIDDEN_NOT_OWNER);
  }
  if (
    order.status === OrderStatus.REFUND_REQUESTED ||
    order.status === OrderStatus.CANCEL_REQUESTED
  ) {
    throw new AppException(REFUND_ERRORS.ALREADY_REQUESTED);
  }
  if (
    order.status === OrderStatus.REFUND_COMPLETED ||
    order.status === OrderStatus.PAYMENT_CANCELLED ||
    order.status === OrderStatus.SETTLEMENT_COMPLETED
  ) {
    throw new AppException(ORDER_ERRORS.ALREADY_PROCESSED);
  }
  if (order.status !== OrderStatus.EXPIRED) {
    throw new AppException(REFUND_ERRORS.REFUND_NOT_ALLOWED);
  }
  if (order.payment?.status !== PaymentStatus.PAID) {
    throw new AppException(PAYMENT_ERRORS.NOT_FOUND);
  }
  const refund = order.payment.refund;
  if (refund !== null && refund.status !== RefundStatus.REJECTED) {
    throw new AppException(REFUND_ERRORS.ALREADY_REQUESTED);
  }
}

export function validateCancelApprovePolicy(
  order: OrderCancelApprovePolicyOrder,
  userId: string,
): void {
  if (order.expertUserId !== userId) {
    throw new AppException(ORDER_ERRORS.FORBIDDEN_NOT_OWNER);
  }
  if (order.status === OrderStatus.PAYMENT_CANCELLED) {
    throw new AppException(ORDER_ERRORS.ALREADY_PROCESSED);
  }
  if (order.status !== OrderStatus.CANCEL_REQUESTED) {
    throw new AppException(REFUND_ERRORS.NOT_APPROVABLE);
  }
  if (
    order.payment?.status !== PaymentStatus.PAID ||
    !order.payment.paymentKey
  ) {
    throw new AppException(PAYMENT_ERRORS.NOT_FOUND);
  }
  const refund = order.payment.refund;
  if (
    refund?.type !== RefundType.CANCEL ||
    refund.status !== RefundStatus.REQUESTED
  ) {
    throw new AppException(REFUND_ERRORS.NOT_APPROVABLE);
  }
}

export function validateCancelRejectPolicy(
  order: OrderCancelApprovePolicyOrder,
  userId: string,
): void {
  if (order.expertUserId !== userId) {
    throw new AppException(ORDER_ERRORS.FORBIDDEN_NOT_OWNER);
  }
  if (order.status === OrderStatus.PAYMENT_CANCELLED) {
    throw new AppException(ORDER_ERRORS.ALREADY_PROCESSED);
  }
  if (order.status !== OrderStatus.CANCEL_REQUESTED) {
    throw new AppException(REFUND_ERRORS.NOT_APPROVABLE);
  }
  const refund = order.payment?.refund;
  if (
    refund?.type !== RefundType.CANCEL ||
    refund.status !== RefundStatus.REQUESTED
  ) {
    throw new AppException(REFUND_ERRORS.NOT_APPROVABLE);
  }
}
