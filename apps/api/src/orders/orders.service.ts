import { Injectable } from '@nestjs/common';
import { OrderStatus, Role, ServiceStatus } from '@prisma/client';

import {
  COMMON_ERRORS,
  ORDER_ERRORS,
  REVIEW_ERRORS,
  SERVICE_ERRORS,
} from '../common/constants/errors';
import { AppException } from '../common/exceptions/app.exception';
import { toPaginatedResponse } from '../common/utils/list-response.util';
import { CreateReviewRequestDto } from '../services/dto/create-review-request.dto';
import { ServiceReviewsQueryDto } from '../services/dto/service-response.dto';
import { UpdateReviewRequestDto } from '../services/dto/update-review-request.dto';
import { mapReview } from '../services/services.mapper';
import { REVIEWABLE_ORDER_STATUSES } from '../services/services.types';

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

  async createReview(
    userId: string,
    orderId: string,
    dto: CreateReviewRequestDto,
  ) {
    const order = await this.ordersRepository.findOrderForReview(orderId);

    if (order === null) {
      throw new AppException(ORDER_ERRORS.NOT_FOUND);
    }

    if (order.clientUserId !== userId) {
      throw new AppException(COMMON_ERRORS.FORBIDDEN);
    }

    if (!REVIEWABLE_ORDER_STATUSES.includes(order.status)) {
      throw new AppException(REVIEW_ERRORS.ORDER_NOT_REVIEWABLE);
    }

    const service = await this.ordersRepository.findServiceById(
      order.serviceId,
    );

    if (service === null) {
      throw new AppException(SERVICE_ERRORS.NOT_FOUND);
    }

    if (order.serviceId !== service.id) {
      throw new AppException(REVIEW_ERRORS.ORDER_SERVICE_MISMATCH);
    }

    if (order.review !== null) {
      throw new AppException(REVIEW_ERRORS.ALREADY_EXISTS);
    }

    const review = await this.ordersRepository.createReview({
      orderId,
      userId,
      rating: dto.rating,
      content: dto.content,
    });

    return mapReview(review);
  }

  async getReviews(orderId: string, query: ServiceReviewsQueryDto) {
    const order = await this.ordersRepository.findOrderForReview(orderId);

    if (order === null) {
      throw new AppException(ORDER_ERRORS.NOT_FOUND);
    }

    const service = await this.ordersRepository.findServiceById(
      order.serviceId,
    );

    if (service === null) {
      throw new AppException(SERVICE_ERRORS.NOT_FOUND);
    }

    if (order.serviceId !== service.id) {
      throw new AppException(REVIEW_ERRORS.ORDER_SERVICE_MISMATCH);
    }

    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 5;
    const sort = query.sort ?? 'latest';
    const skip = (page - 1) * pageSize;

    const [items, totalCount, statsMap] = await Promise.all([
      this.ordersRepository.findReviews({
        orderId,
        skip,
        take: pageSize,
        sort,
      }),
      this.ordersRepository.countReviews(orderId),
      this.ordersRepository.getReviewStatsByOrderIds([orderId]),
    ]);

    const stats = statsMap.get(orderId) ?? { reviewCount: 0, rating: 0 };

    return {
      ...toPaginatedResponse(
        items.map((review) => mapReview(review)),
        { page, pageSize, totalCount },
      ),
      averageRating: stats.rating,
    };
  }

  async updateReview(
    userId: string,
    orderId: string,
    reviewId: string,
    dto: UpdateReviewRequestDto,
  ) {
    const review = await this.ordersRepository.findReviewById(
      reviewId,
      orderId,
    );
    if (review === null) {
      throw new AppException(REVIEW_ERRORS.NOT_FOUND);
    }

    if (review.user.id !== userId) {
      throw new AppException(COMMON_ERRORS.FORBIDDEN);
    }

    if (review.orderId !== orderId) {
      throw new AppException(REVIEW_ERRORS.ORDER_REVIEW_MISMATCH);
    }

    const updated = await this.ordersRepository.updateReview(reviewId, {
      rating: dto.rating,
      content: dto.content,
    });

    return mapReview(updated);
  }
}
