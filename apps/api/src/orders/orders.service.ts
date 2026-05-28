import { Injectable } from '@nestjs/common';
import {
  OrderStatus,
  PaymentStatus,
  Role,
  ServiceStatus,
  type Prisma,
} from '@prisma/client';

import {
  COMMON_ERRORS,
  ORDER_ERRORS,
  PAYMENT_ERRORS,
  SERVICE_ERRORS,
} from '../common/constants/errors';
import { AppException } from '../common/exceptions/app.exception';
import { toPaginatedResponse } from '../common/utils/list-response.util';

import { CreateOrderRequestDto } from './dto/create-order-request.dto';
import { UpdateOrderStatusRequestDto } from './dto/update-order-status-request.dto';
import {
  ORDER_LIST_USER_ID_FIELD,
  ORDERS_LIST_DEFAULT_PAGE,
  ORDERS_LIST_DEFAULT_PAGE_SIZE,
  PAYMENT_AMOUNT_VALIDATION_FAILED_REASON,
  PG_STUB_PROVIDER,
  PG_STUB_RECEIPT_URL,
  PLATFORM_FEE_RATE,
} from './orders.constants';
import { mapOrderDetail } from './orders.mapper';
import { OrdersRepository } from './orders.repository';

import type { GetOrdersQueryDto } from './dto/get-orders-query.dto';

type OrderWithPayment = Prisma.OrderGetPayload<{
  include: { payment: true };
}>;

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async getOrders(userId: string, query: GetOrdersQueryDto) {
    const page = query.page ?? ORDERS_LIST_DEFAULT_PAGE;
    const pageSize = query.pageSize ?? ORDERS_LIST_DEFAULT_PAGE_SIZE;
    const skip = (page - 1) * pageSize;
    const field = ORDER_LIST_USER_ID_FIELD[query.as];

    const [orders, totalCount] = await Promise.all([
      this.ordersRepository.findOrdersByUser({
        userId,
        field,
        statuses: query.status,
        skip,
        take: pageSize,
      }),
      this.ordersRepository.countOrdersByUser({
        userId,
        field,
        statuses: query.status,
      }),
    ]);

    return toPaginatedResponse(orders, { page, pageSize, totalCount });
  }

  async getOrderDetail(userId: string, orderId: string) {
    const order = await this.ordersRepository.findOrderDetail(orderId);
    if (!order) throw new AppException(ORDER_ERRORS.NOT_FOUND);

    if (order.clientUserId !== userId && order.expertUserId !== userId) {
      throw new AppException(ORDER_ERRORS.FORBIDDEN_NOT_OWNER);
    }

    return mapOrderDetail(order);
  }

  async initializeOrder(clientUserId: string, dto: CreateOrderRequestDto) {
    const service = await this.ordersRepository.findServiceById(dto.serviceId);
    if (!service) throw new AppException(SERVICE_ERRORS.NOT_FOUND);

    if (service.status !== ServiceStatus.ACTIVE) {
      throw new AppException(SERVICE_ERRORS.NOT_AVAILABLE);
    }

    if (service.expertUserId === clientUserId) {
      throw new AppException(ORDER_ERRORS.FORBIDDEN_SELF_ORDER);
    }

    const agreedServicePrice = service.servicePrice;
    const platformFee = Math.floor(agreedServicePrice * PLATFORM_FEE_RATE);
    const totalAmount = agreedServicePrice + platformFee;

    return this.ordersRepository.createPendingOrder({
      clientUserId,
      expertUserId: service.expertUserId,
      serviceId: service.id,
      agreedServicePrice,
      platformFee,
      totalAmount,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      paymentMethod: dto.paymentMethod,
    });
  }

  async updateOrderStatus(
    userId: string,
    userRole: Role,
    orderId: string,
    dto: UpdateOrderStatusRequestDto,
  ) {
    const order = await this.ordersRepository.findOrderWithPayment(orderId);
    if (!order) throw new AppException(ORDER_ERRORS.NOT_FOUND);

    if (dto.status === OrderStatus.IN_PROGRESS) {
      if (dto.paymentKey === undefined || dto.paidAmount === undefined) {
        throw new AppException(COMMON_ERRORS.VALIDATION_ERROR);
      }
      if (order.clientUserId !== userId) {
        throw new AppException(ORDER_ERRORS.FORBIDDEN_NOT_OWNER);
      }
      if (
        order.status === OrderStatus.CANCEL_REQUESTED ||
        order.status === OrderStatus.PAYMENT_CANCELLED
      ) {
        throw new AppException(ORDER_ERRORS.ALREADY_CANCELED);
      }
      return this.verifyAndApprovePayment(
        order,
        dto.paymentKey,
        dto.paidAmount,
      );
    }

    this.validateStatusTransition(order, dto.status, userId, userRole);
    const updated = await this.ordersRepository.updateOrderStatusOnly(
      orderId,
      order.status,
      dto.status,
    );
    if (!updated) throw new AppException(ORDER_ERRORS.INVALID_STATUS);
    return updated;
  }

  private async verifyAndApprovePayment(
    order: OrderWithPayment,
    paymentKey: string,
    paidAmount: number,
  ) {
    if (!order.payment) throw new AppException(PAYMENT_ERRORS.NOT_FOUND);

    const canVerify =
      order.status === OrderStatus.NEGOTIATING &&
      (order.payment.status === PaymentStatus.PENDING ||
        order.payment.status === PaymentStatus.FAILED);
    if (!canVerify) {
      throw new AppException(ORDER_ERRORS.ALREADY_PROCESSED);
    }

    const pgVerifiedAmount = await this.fetchAmountFromExternalPG(
      paymentKey,
      paidAmount,
    );

    if (
      order.totalAmount !== paidAmount ||
      pgVerifiedAmount !== order.totalAmount
    ) {
      await this.ordersRepository.updatePaymentToFailed(order.id, {
        reason: PAYMENT_AMOUNT_VALIDATION_FAILED_REASON,
        orderId: order.id,
        clientPaidAmount: paidAmount,
        pgVerifiedAmount,
        paymentKey,
      });
      throw new AppException(ORDER_ERRORS.AMOUNT_MISMATCH);
    }

    const mockRawData = {
      provider: PG_STUB_PROVIDER,
      receiptUrl: PG_STUB_RECEIPT_URL,
      approvedAt: new Date().toISOString(),
    };

    const result = await this.ordersRepository.updateOrderAndPaymentToPaid(
      order.id,
      paymentKey,
      paidAmount,
      mockRawData,
    );
    if (!result) throw new AppException(PAYMENT_ERRORS.ALREADY_CONFIRMED);
    return result;
  }

  private validateStatusTransition(
    order: OrderWithPayment,
    nextStatus: OrderStatus,
    userId: string,
    userRole: Role,
  ): void {
    const current = order.status;

    if (
      current === OrderStatus.SETTLEMENT_COMPLETED ||
      current === OrderStatus.REFUND_COMPLETED
    ) {
      throw new AppException(ORDER_ERRORS.ALREADY_PROCESSED);
    }

    if (
      current === OrderStatus.NEGOTIATING &&
      nextStatus === OrderStatus.CANCEL_REQUESTED
    ) {
      if (order.clientUserId !== userId) {
        throw new AppException(ORDER_ERRORS.FORBIDDEN_NOT_OWNER);
      }
      return;
    }

    if (
      current === OrderStatus.IN_PROGRESS &&
      nextStatus === OrderStatus.WORK_COMPLETED
    ) {
      if (order.expertUserId !== userId || userRole !== Role.EXPERT) {
        throw new AppException(ORDER_ERRORS.FORBIDDEN_NOT_OWNER);
      }
      return;
    }

    if (
      current === OrderStatus.WORK_COMPLETED &&
      nextStatus === OrderStatus.PURCHASE_CONFIRMED
    ) {
      if (order.clientUserId !== userId || userRole !== Role.CLIENT) {
        throw new AppException(ORDER_ERRORS.FORBIDDEN_NOT_OWNER);
      }
      return;
    }

    throw new AppException(ORDER_ERRORS.INVALID_STATUS);
  }

  private fetchAmountFromExternalPG(
    _paymentKey: string,
    paidAmount: number,
  ): Promise<number> {
    return Promise.resolve(paidAmount);
  }
}
