import { Injectable, Logger } from '@nestjs/common';
import {
  NotificationCategory,
  OrderStatus,
  Role,
  ServiceStatus,
} from '@prisma/client';

import {
  COMMON_ERRORS,
  ORDER_ERRORS,
  PAYMENT_ERRORS,
  REVIEW_ERRORS,
  SERVICE_ERRORS,
} from '../common/constants/errors';
import { AppException } from '../common/exceptions/app.exception';
import { Paginated } from '../common/types/paginated.type';
import { toPaginatedResponse } from '../common/utils/list-response.util';
import { NotificationsService } from '../notifications/notifications.service';
import { PaymentsService } from '../payments/payments.service';
import { CreateReviewRequestDto } from '../services/dto/create-review-request.dto';
import { MyReviewsQueryDto } from '../services/dto/my-reviews-query.dto';
import { MyReviewListItemResponseDto } from '../services/dto/service-response.dto';
import { UpdateReviewRequestDto } from '../services/dto/update-review-request.dto';
import { mapMyReviewListItem, mapReview } from '../services/services.mapper';
import { REVIEWABLE_ORDER_STATUSES } from '../services/services.types';

import {
  calculatePlatformFee,
  ORDER_LIST_DEFAULT_SORT,
  ORDER_LIST_USER_ID_FIELD,
  ORDERS_LIST_DEFAULT_PAGE,
  ORDERS_LIST_DEFAULT_PAGE_SIZE,
} from './orders.constants';
import {
  mapCreateOrderResponse,
  mapOrderListItem,
  mapUpdateOrderScheduleResponse,
  mapUpdateOrderStatusResponse,
} from './orders.mapper';
import {
  validateCancelPolicy,
  validateCancelRequestPolicy,
  validateRefundPolicy,
  validateRefundRequestCancelPolicy,
  validateRefundRequestPolicy,
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
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly paymentsService: PaymentsService,
    private readonly notificationsService: NotificationsService,
  ) {}

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

  async createOrder(clientUserId: string, dto: CreateOrderRequestDto) {
    const service = await this.ordersRepository.findServiceById(dto.serviceId);
    if (!service) throw new AppException(SERVICE_ERRORS.NOT_FOUND);

    if (service.status !== ServiceStatus.ACTIVE) {
      throw new AppException(SERVICE_ERRORS.NOT_AVAILABLE);
    }

    const agreedServicePrice = service.servicePrice;
    const platformFee = calculatePlatformFee(agreedServicePrice);
    const totalAmount = agreedServicePrice + platformFee;

    if (totalAmount !== dto.amount) {
      throw new AppException(PAYMENT_ERRORS.AMOUNT_MISMATCH);
    }

    const toss = await this.paymentsService.confirmTossPayment(
      dto.paymentKey,
      dto.orderId,
      totalAmount,
    );

    try {
      const order = await this.ordersRepository.createOrder({
        id: dto.orderId,
        clientUserId,
        expertUserId: service.expertUserId,
        serviceId: service.id,
        agreedServicePrice,
        platformFee,
        totalAmount,
        paymentKey: dto.paymentKey,
        approvedAt: toss.approvedAt,
        method: toss.method,
        installmentMonths: toss.installmentMonths,
        rawData: toss.rawData,
      });
      return mapCreateOrderResponse(order);
    } catch (error: unknown) {
      this.logger.error(
        `Toss 승인 후 Order 생성 실패. orderId=${dto.orderId}, paymentKey=${dto.paymentKey}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
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
      throw new AppException(ORDER_ERRORS.FORBIDDEN_NOT_OWNER);
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

    if (order.review !== null) {
      throw new AppException(REVIEW_ERRORS.ALREADY_EXISTS);
    }

    const review = await this.ordersRepository.createReview({
      orderId,
      userId,
      expertUserId: order.expertUserId,
      rating: dto.rating,
      content: dto.content,
    });

    return mapReview(review);
  }

  async getAllReviewsByUserId(
    userId: string,
    query: MyReviewsQueryDto,
  ): Promise<Paginated<MyReviewListItemResponseDto>> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const sort = query.sort ?? 'latest';
    const skip = (page - 1) * pageSize;

    const [reviews, totalCount] = await Promise.all([
      this.ordersRepository.findAllReviewsByUserId({
        userId,
        skip,
        take: pageSize,
        sort,
      }),
      this.ordersRepository.countReviewsByUserId(userId),
    ]);

    return toPaginatedResponse(
      reviews.map((review) => mapMyReviewListItem(review)),
      { page, pageSize, totalCount },
    );
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

  async deleteReview(userId: string, orderId: string, reviewId: string) {
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

    await this.ordersRepository.deleteReview(reviewId);
  }

  async requestCancelOrder(clientUserId: string, orderId: string) {
    const order =
      await this.ordersRepository.findOrderCancelRequestPolicy(orderId);
    if (!order) throw new AppException(ORDER_ERRORS.NOT_FOUND);

    validateCancelRequestPolicy(order, clientUserId);

    const payment = order.payment;
    if (!payment?.paymentKey) throw new AppException(PAYMENT_ERRORS.NOT_FOUND);

    const updated = await this.ordersRepository.requestCancel({
      orderId,
      clientUserId: order.clientUserId,
      expertUserId: order.expertUserId,
      paidAmount: payment.paidAmount,
      paymentKey: payment.paymentKey,
    });

    await this.notificationsService
      .send({
        userIds: [order.expertUserId],
        category: NotificationCategory.ORDER_CANCEL_REQUESTED,
        vars: {
          serviceTitle: order.service.title,
          clientName: order.clientUser.name ?? '회원',
        },
        referenceId: orderId,
      })
      .catch((error: unknown) => {
        this.logger.error(
          `취소 요청 알림 발송 실패(전문가). orderId=${orderId}`,
          error instanceof Error ? error.stack : String(error),
        );
      });

    await this.notificationsService
      .send({
        userIds: [order.clientUserId],
        category: NotificationCategory.ORDER_CANCEL_REQUESTED_TO_CLIENT,
        vars: { serviceTitle: order.service.title },
        referenceId: orderId,
      })
      .catch((error: unknown) => {
        this.logger.error(
          `취소 요청 알림 발송 실패(본인). orderId=${orderId}`,
          error instanceof Error ? error.stack : String(error),
        );
      });

    return mapUpdateOrderStatusResponse(updated);
  }

  async approveCancelOrder(expertUserId: string, orderId: string) {
    const order =
      await this.ordersRepository.findOrderCancelApprovePolicy(orderId);
    if (!order) throw new AppException(ORDER_ERRORS.NOT_FOUND);

    validateCancelPolicy(order, expertUserId, 'approve');

    const payment = order.payment;
    if (!payment?.paymentKey) throw new AppException(PAYMENT_ERRORS.NOT_FOUND);

    const { canceledAt, rawData } =
      await this.paymentsService.cancelTossPayment(
        payment.paymentKey,
        '전문가 취소 승인',
        payment.paidAmount,
      );

    try {
      const updated = await this.ordersRepository.approveCancel({
        orderId,
        refundAmount: payment.paidAmount,
        canceledAt,
        rawData,
      });

      await this.notificationsService
        .send({
          userIds: [order.clientUserId],
          category: NotificationCategory.ORDER_CANCEL_APPROVED_BY_EXPERT,
          vars: { serviceTitle: order.service.title },
          referenceId: orderId,
        })
        .catch((error: unknown) => {
          this.logger.error(
            `취소 승인 알림 발송 실패. orderId=${orderId}`,
            error instanceof Error ? error.stack : String(error),
          );
        });

      return mapUpdateOrderStatusResponse(updated);
    } catch (error) {
      this.logger.error(
        `Toss 취소 후 DB 갱신 실패. orderId=${orderId}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  async rejectCancelOrder(expertUserId: string, orderId: string) {
    const order =
      await this.ordersRepository.findOrderCancelApprovePolicy(orderId);
    if (!order) throw new AppException(ORDER_ERRORS.NOT_FOUND);

    validateCancelPolicy(order, expertUserId, 'reject');

    const updated = await this.ordersRepository.rejectCancel(orderId);

    await this.notificationsService
      .send({
        userIds: [order.clientUserId],
        category: NotificationCategory.ORDER_CANCEL_REJECTED_BY_EXPERT,
        vars: { serviceTitle: order.service.title },
        referenceId: orderId,
      })
      .catch((error: unknown) => {
        this.logger.error(
          `취소 거절 알림 발송 실패. orderId=${orderId}`,
          error instanceof Error ? error.stack : String(error),
        );
      });

    return mapUpdateOrderStatusResponse(updated);
  }

  async requestRefundOrder(clientUserId: string, orderId: string) {
    const order =
      await this.ordersRepository.findOrderCancelRequestPolicy(orderId);
    if (!order) throw new AppException(ORDER_ERRORS.NOT_FOUND);

    validateRefundRequestPolicy(order, clientUserId);

    const payment = order.payment;
    if (!payment?.paymentKey) throw new AppException(PAYMENT_ERRORS.NOT_FOUND);

    const updated = await this.ordersRepository.requestRefund({
      orderId,
      clientUserId: order.clientUserId,
      expertUserId: order.expertUserId,
      paidAmount: payment.paidAmount,
      paymentKey: payment.paymentKey,
    });

    await this.notificationsService
      .send({
        userIds: [order.expertUserId],
        category: NotificationCategory.REFUND_REQUESTED,
        vars: {
          serviceTitle: order.service.title,
          clientName: order.clientUser.name ?? '회원',
        },
        referenceId: orderId,
      })
      .catch((error: unknown) => {
        this.logger.error(
          `환불 요청 알림 발송 실패(전문가). orderId=${orderId}`,
          error instanceof Error ? error.stack : String(error),
        );
      });

    await this.notificationsService
      .send({
        userIds: [order.clientUserId],
        category: NotificationCategory.REFUND_REQUESTED_TO_CLIENT,
        vars: { serviceTitle: order.service.title },
        referenceId: orderId,
      })
      .catch((error: unknown) => {
        this.logger.error(
          `환불 요청 알림 발송 실패(본인). orderId=${orderId}`,
          error instanceof Error ? error.stack : String(error),
        );
      });

    return mapUpdateOrderStatusResponse(updated);
  }

  async approveRefundOrder(expertUserId: string, orderId: string) {
    const order =
      await this.ordersRepository.findOrderCancelApprovePolicy(orderId);
    if (!order) throw new AppException(ORDER_ERRORS.NOT_FOUND);

    validateRefundPolicy(order, expertUserId, 'approve');

    const payment = order.payment;
    if (!payment?.paymentKey) throw new AppException(PAYMENT_ERRORS.NOT_FOUND);

    const { canceledAt, rawData } =
      await this.paymentsService.cancelTossPayment(
        payment.paymentKey,
        '전문가 환불 승인',
        payment.paidAmount,
      );

    try {
      const updated = await this.ordersRepository.approveRefund({
        orderId,
        refundAmount: payment.paidAmount,
        canceledAt,
        rawData,
      });

      await this.notificationsService
        .send({
          userIds: [order.clientUserId],
          category: NotificationCategory.REFUND_APPROVED_BY_EXPERT,
          vars: { serviceTitle: order.service.title },
          referenceId: orderId,
        })
        .catch((error: unknown) => {
          this.logger.error(
            `환불 승인 알림 발송 실패. orderId=${orderId}`,
            error instanceof Error ? error.stack : String(error),
          );
        });

      return mapUpdateOrderStatusResponse(updated);
    } catch (error) {
      this.logger.error(
        `Toss 환불 승인 후 DB 갱신 실패. orderId=${orderId}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  async rejectRefundOrder(expertUserId: string, orderId: string) {
    const order =
      await this.ordersRepository.findOrderCancelApprovePolicy(orderId);
    if (!order) throw new AppException(ORDER_ERRORS.NOT_FOUND);

    validateRefundPolicy(order, expertUserId, 'reject');

    const updated = await this.ordersRepository.rejectRefund(orderId);

    await this.notificationsService
      .send({
        userIds: [order.clientUserId],
        category: NotificationCategory.REFUND_REJECTED_BY_EXPERT,
        vars: { serviceTitle: order.service.title },
        referenceId: orderId,
      })
      .catch((error: unknown) => {
        this.logger.error(
          `환불 거절 알림 발송 실패. orderId=${orderId}`,
          error instanceof Error ? error.stack : String(error),
        );
      });

    return mapUpdateOrderStatusResponse(updated);
  }

  async cancelRefundRequestOrder(clientUserId: string, orderId: string) {
    const order =
      await this.ordersRepository.findOrderCancelRequestPolicy(orderId);
    if (!order) throw new AppException(ORDER_ERRORS.NOT_FOUND);

    validateRefundRequestCancelPolicy(order, clientUserId);

    const updated = await this.ordersRepository.cancelRefundRequest(orderId);

    await this.notificationsService
      .send({
        userIds: [order.expertUserId],
        category: NotificationCategory.REFUND_REQUEST_CANCELLED,
        vars: {
          serviceTitle: order.service.title,
          clientName: order.clientUser.name ?? '회원',
        },
        referenceId: orderId,
      })
      .catch((error: unknown) => {
        this.logger.error(
          `환불 요청 취소 알림 발송 실패. orderId=${orderId}`,
          error instanceof Error ? error.stack : String(error),
        );
      });

    return mapUpdateOrderStatusResponse(updated);
  }
}
