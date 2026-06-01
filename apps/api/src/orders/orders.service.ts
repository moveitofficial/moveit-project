import { Injectable } from '@nestjs/common';
import { OrderStatus, Role, ServiceStatus } from '@prisma/client';

import { ORDER_ERRORS, SERVICE_ERRORS } from '../common/constants/errors';
import { AppException } from '../common/exceptions/app.exception';
import { toPaginatedResponse } from '../common/utils/list-response.util';

import {
  ORDER_LIST_DEFAULT_SORT,
  ORDER_LIST_USER_ID_FIELD,
  ORDERS_LIST_DEFAULT_PAGE,
  ORDERS_LIST_DEFAULT_PAGE_SIZE,
  PG_STUB_PROVIDER,
  PG_STUB_RECEIPT_URL,
  PLATFORM_FEE_RATE,
} from './orders.constants';
import {
  mapCreateOrderResponse,
  mapOrderListItem,
  mapUpdateOrderScheduleResponse,
  mapUpdateOrderStatusResponse,
} from './orders.mapper';
import {
  validateConfirmOrderPolicy,
  validateOrderStatusAuthority,
  validateOrderStatusFlow,
  validateScheduleAuthority,
  validateSettlementRequestPolicy,
} from './orders.policy';
import { OrdersRepository } from './orders.repository';

import type { CreateOrderRequestDto } from './dto/create-order-request.dto';
import type { GetOrdersQueryDto } from './dto/get-orders-query.dto';
import type { UpdateOrderScheduleRequestDto } from './dto/update-order-schedule-request.dto';
import type { UpdateOrderStatusRequestDto } from './dto/update-order-status-request.dto';

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

  async initializeOrder(clientUserId: string, dto: CreateOrderRequestDto) {
    const service = await this.ordersRepository.findServiceById(dto.serviceId);
    if (!service) throw new AppException(SERVICE_ERRORS.NOT_FOUND);

    if (service.status !== ServiceStatus.ACTIVE) {
      throw new AppException(SERVICE_ERRORS.NOT_AVAILABLE);
    }

    const agreedServicePrice = service.servicePrice;
    const platformFee = Math.floor(agreedServicePrice * PLATFORM_FEE_RATE);
    const totalAmount = agreedServicePrice + platformFee;

    const pgVerifiedAmount = await this.fetchAmountFromExternalPG(
      dto.paymentKey,
      dto.paidAmount,
    );

    if (totalAmount !== dto.paidAmount || pgVerifiedAmount !== totalAmount) {
      throw new AppException(ORDER_ERRORS.AMOUNT_MISMATCH);
    }

    const order = await this.ordersRepository.createPaidOrder({
      clientUserId,
      expertUserId: service.expertUserId,
      serviceId: service.id,
      agreedServicePrice,
      platformFee,
      totalAmount,
      paymentKey: dto.paymentKey,
      paidAmount: dto.paidAmount,
      rawData: {
        provider: PG_STUB_PROVIDER,
        receiptUrl: PG_STUB_RECEIPT_URL,
        approvedAt: new Date().toISOString(),
      },
    });

    return mapCreateOrderResponse(order);
  }

  async updateOrderStatus(
    userId: string,
    userRole: Role,
    orderId: string,
    dto: UpdateOrderStatusRequestDto,
  ) {
    const order = await this.ordersRepository.findOrderPolicy(orderId);
    if (!order) throw new AppException(ORDER_ERRORS.NOT_FOUND);

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

  async updateOrderSchedule(
    userId: string,
    userRole: Role,
    orderId: string,
    dto: UpdateOrderScheduleRequestDto,
  ) {
    const order = await this.ordersRepository.findOrderSchedulePolicy(orderId);
    if (!order) throw new AppException(ORDER_ERRORS.NOT_FOUND);

    validateScheduleAuthority(order, userId, userRole);

    const endDate = new Date(dto.endDate);

    const updated =
      order.status === OrderStatus.NEGOTIATING && order.endDate === null
        ? await this.ordersRepository.updateOrderSchedule({
            orderId,
            fromStatus: OrderStatus.NEGOTIATING,
            endDate,
            toStatus: OrderStatus.IN_PROGRESS,
          })
        : await this.ordersRepository.updateOrderSchedule({
            orderId,
            fromStatus: order.status,
            endDate,
          });

    if (!updated) throw new AppException(ORDER_ERRORS.INVALID_STATUS);
    return mapUpdateOrderScheduleResponse(updated);
  }

  async confirmOrder(userId: string, orderId: string) {
    const order = await this.ordersRepository.findOrderPolicy(orderId);
    if (!order) throw new AppException(ORDER_ERRORS.NOT_FOUND);

    validateConfirmOrderPolicy(order, userId);

    const updated = await this.ordersRepository.updateOrderStatusOnly(
      orderId,
      OrderStatus.WORK_COMPLETED,
      OrderStatus.PURCHASE_CONFIRMED,
    );
    if (!updated) throw new AppException(ORDER_ERRORS.INVALID_STATUS);
    return mapUpdateOrderStatusResponse(updated);
  }

  async requestSettlement(userId: string, orderId: string) {
    const order = await this.ordersRepository.findOrderPolicy(orderId);
    if (!order) throw new AppException(ORDER_ERRORS.NOT_FOUND);

    validateSettlementRequestPolicy(order, userId);

    const updated = await this.ordersRepository.updateOrderStatusOnly(
      orderId,
      OrderStatus.PURCHASE_CONFIRMED,
      OrderStatus.SETTLEMENT_REQUESTED,
    );
    if (!updated) throw new AppException(ORDER_ERRORS.INVALID_STATUS);
    return mapUpdateOrderStatusResponse(updated);
  }

  private fetchAmountFromExternalPG(
    _paymentKey: string,
    paidAmount: number,
  ): Promise<number> {
    return Promise.resolve(paidAmount);
  }
}
