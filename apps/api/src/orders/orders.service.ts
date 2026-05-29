import { Injectable } from '@nestjs/common';
import {
  OrderStatus,
  PaymentStatus,
  Role,
  ServiceStatus,
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
  ORDER_LIST_DEFAULT_SORT,
  ORDER_LIST_USER_ID_FIELD,
  ORDERS_LIST_DEFAULT_PAGE,
  ORDERS_LIST_DEFAULT_PAGE_SIZE,
  PAYMENT_AMOUNT_VALIDATION_FAILED_REASON,
  PG_STUB_PROVIDER,
  PG_STUB_RECEIPT_URL,
  PLATFORM_FEE_RATE,
} from './orders.constants';
import {
  mapCreateOrderResponse,
  mapOrderDetail,
  mapOrderListItem,
  mapUpdateOrderStatusResponse,
} from './orders.mapper';
import {
  validateOrderStatusAuthority,
  validateOrderStatusFlow,
} from './orders.policy';
import { OrdersRepository } from './orders.repository';

import type { GetOrdersQueryDto } from './dto/get-orders-query.dto';
import type { OrderWithPayment } from './orders.types';
import type { Order } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async getOrders(userId: string, query: GetOrdersQueryDto) {
    const page = query.page ?? ORDERS_LIST_DEFAULT_PAGE;
    const pageSize = query.pageSize ?? ORDERS_LIST_DEFAULT_PAGE_SIZE;
    const skip = (page - 1) * pageSize;
    const field = ORDER_LIST_USER_ID_FIELD[query.as];
    const sort = query.sort ?? ORDER_LIST_DEFAULT_SORT;

    const [orders, totalCount] = await Promise.all([
      this.ordersRepository.findOrdersByUser({
        userId,
        field,
        statuses: query.status,
        sort,
        skip,
        take: pageSize,
      }),
      this.ordersRepository.countOrdersByUser({
        userId,
        field,
        statuses: query.status,
      }),
    ]);

    return toPaginatedResponse(
      orders.map((order) => mapOrderListItem(order)),
      {
        page,
        pageSize,
        totalCount,
      },
    );
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

    const agreedServicePrice = service.servicePrice;
    const platformFee = Math.floor(agreedServicePrice * PLATFORM_FEE_RATE);
    const totalAmount = agreedServicePrice + platformFee;

    const order = await this.ordersRepository.createPendingOrder({
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

    return mapCreateOrderResponse(order);
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
      if (
        order.status === OrderStatus.CANCEL_REQUESTED ||
        order.status === OrderStatus.PAYMENT_CANCELLED
      ) {
        throw new AppException(ORDER_ERRORS.ALREADY_CANCELED);
      }

      validateOrderStatusAuthority(order, dto.status, userId, userRole);
      validateOrderStatusFlow(order.status, dto.status);

      const paid = await this.verifyAndApprovePayment(
        order,
        dto.paymentKey,
        dto.paidAmount,
      );
      return mapUpdateOrderStatusResponse(paid);
    }

    validateOrderStatusAuthority(order, dto.status, userId, userRole);
    validateOrderStatusFlow(order.status, dto.status);
    const updated = await this.ordersRepository.updateOrderStatusOnly(
      orderId,
      order.status,
      dto.status,
    );
    if (!updated) throw new AppException(ORDER_ERRORS.INVALID_STATUS);
    return mapUpdateOrderStatusResponse(updated);
  }

  private async verifyAndApprovePayment(
    order: OrderWithPayment,
    paymentKey: string,
    paidAmount: number,
  ): Promise<Order> {
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

  private fetchAmountFromExternalPG(
    _paymentKey: string,
    paidAmount: number,
  ): Promise<number> {
    return Promise.resolve(paidAmount);
  }
}
