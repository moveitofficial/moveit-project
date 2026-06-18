import { Injectable, Logger } from '@nestjs/common';
import {
  NotificationCategory,
  OrderStatus,
  Role,
  ServiceStatus,
} from '@prisma/client';

import { ChatService } from '../chats/chat/chat.service';
import {
  COMMON_ERRORS,
  ORDER_ERRORS,
  PAYMENT_ERRORS,
  REVIEW_ERRORS,
  SERVICE_ERRORS,
} from '../common/constants/errors';
import { AppException } from '../common/exceptions/app.exception';
import { Paginated } from '../common/types/paginated.type';
import { toKstDate } from '../common/utils/date.util';
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
  DEADLINE_IMMINENT_DAYS,
  MS_PER_DAY,
  ORDER_LIST_AS,
  ORDER_LIST_DEFAULT_SORT,
  ORDER_LIST_USER_ID_FIELD,
  ORDER_TAB_STATUSES,
  ORDERS_LIST_DEFAULT_PAGE,
  ORDERS_LIST_DEFAULT_PAGE_SIZE,
  SCHEDULE_LIST_STATUSES,
  SCHEDULE_TAB_STATUSES,
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
import type { OrderReviewResponseDto } from './dto/order-review-response.dto';
import type {
  ClientOrderSummaryDto,
  ExpertOrderSummaryDto,
} from './dto/order-summary-response.dto';
import type {
  ClientOrderTabCountsDto,
  ExpertOrderTabCountsDto,
} from './dto/order-tab-counts-response.dto';
import type { PayOrderRequestDto } from './dto/pay-order-request.dto';
import type { ScheduleChangeRequestDto } from './dto/schedule-change-request.dto';
import type { ScheduleTabCountsResponseDto } from './dto/schedule-tab-counts-response.dto';
import type { UpdateOrderScheduleRequestDto } from './dto/update-order-schedule-request.dto';
import type { UpdateOrderStatusRequestDto } from './dto/update-order-status-request.dto';
import type { OrderListAs } from './orders.constants';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly paymentsService: PaymentsService,
    private readonly notificationsService: NotificationsService,
    private readonly chatService: ChatService,
  ) {}

  async payOrder(
    clientUserId: string,
    orderId: string,
    dto: PayOrderRequestDto,
  ) {
    const order = await this.ordersRepository.findPendingOrderForPay(orderId);
    if (!order) throw new AppException(ORDER_ERRORS.NOT_FOUND);
    if (order.clientUserId !== clientUserId)
      throw new AppException(ORDER_ERRORS.FORBIDDEN_NOT_OWNER);
    if (order.status !== OrderStatus.PENDING)
      throw new AppException(ORDER_ERRORS.INVALID_STATUS);
    if (order.totalAmount !== dto.amount)
      throw new AppException(PAYMENT_ERRORS.AMOUNT_MISMATCH);

    const toss = await this.paymentsService.confirmTossPayment(
      dto.paymentKey,
      orderId,
      order.totalAmount,
    );

    try {
      const updated = await this.ordersRepository.payPendingOrder({
        orderId,
        clientUserId,
        totalAmount: order.totalAmount,
        paymentKey: dto.paymentKey,
        approvedAt: toss.approvedAt,
        method: toss.method,
        installmentMonths: toss.installmentMonths,
        rawData: toss.rawData,
      });
      if (!updated) throw new AppException(ORDER_ERRORS.INVALID_STATUS);

      if (dto.roomId) {
        const roomId = dto.roomId;
        void (async () => {
          try {
            await this.chatService.sendSystemMessage(
              roomId,
              'PAYMENT_COMPLETED',
              {
                systemType: 'PAYMENT_COMPLETED',
                serviceTitle: order.service.title,
                servicePrice: order.agreedServicePrice,
                platformFee: order.platformFee,
                totalAmount: order.totalAmount,
                expertSettlementAmount: order.agreedServicePrice,
              },
              orderId,
            );
            await this.chatService.sendSystemMessage(
              roomId,
              'PAYMENT_HELD',
              { systemType: 'PAYMENT_HELD' },
              orderId,
            );
            await this.chatService.sendSystemMessage(
              roomId,
              'SCHEDULE_REQUEST',
              { systemType: 'SCHEDULE_REQUEST' },
              orderId,
            );
          } catch (error: unknown) {
            this.logger.error(
              `결제 후 시스템 메시지 발송 실패. orderId=${orderId}`,
              error instanceof Error ? error.stack : String(error),
            );
          }
        })();
      }

      const kstDate = toKstDate(new Date());
      this.ordersRepository
        .upsertStatistics({
          sellerUserId: order.expertUserId,
          serviceGroupId: order.service.serviceGroupId,
          serviceCategoryId: order.service.serviceCategoryId,
          agreedServicePrice: order.agreedServicePrice,
          date: kstDate,
        })
        .catch((error: unknown) => {
          this.logger.error(
            `통계 upsert 실패. orderId=${orderId}`,
            error instanceof Error ? error.stack : String(error),
          );
        });

      return mapCreateOrderResponse(updated);
    } catch (error: unknown) {
      this.logger.error(
        `Toss 승인 후 PENDING Order 결제 처리 실패. orderId=${orderId}, paymentKey=${dto.paymentKey}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

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
        search: query.search,
      }),
      this.ordersRepository.countOrdersByUser({
        userId,
        field,
        statuses: query.status,
        search: query.search,
      }),
    ]);

    const pendingScheduleChangeIds =
      await this.ordersRepository.findPendingScheduleChangeOrderIds(
        orders.map((order) => order.id),
      );

    return toPaginatedResponse(
      orders.map((order) =>
        mapOrderListItem(
          order,
          order.chatRoomId ?? null,
          pendingScheduleChangeIds.has(order.id),
        ),
      ),
      {
        page,
        pageSize,
        totalCount,
      },
    );
  }

  async getOrderSummary(
    userId: string,
    as: OrderListAs,
  ): Promise<ClientOrderSummaryDto | ExpertOrderSummaryDto> {
    const field = ORDER_LIST_USER_ID_FIELD[as];
    const count = (statuses: OrderStatus[]): Promise<number> =>
      this.ordersRepository.countOrdersByUser({ userId, field, statuses });

    if (as === ORDER_LIST_AS.EXPERT) {
      const [newOrder, inProgress, deadlineImminent, purchaseConfirmPending] =
        await Promise.all([
          count([OrderStatus.NEGOTIATING]),
          count([OrderStatus.IN_PROGRESS]),
          count([OrderStatus.DEADLINE_IMMINENT]),
          count([OrderStatus.WORK_COMPLETED]),
        ]);
      return { newOrder, inProgress, deadlineImminent, purchaseConfirmPending };
    }

    const [inProgress, purchaseConfirmPending, reviewable, refund] =
      await Promise.all([
        count([OrderStatus.IN_PROGRESS]),
        count([OrderStatus.WORK_COMPLETED]),
        count(REVIEWABLE_ORDER_STATUSES),
        count([OrderStatus.REFUND_REQUESTED, OrderStatus.REFUND_COMPLETED]),
      ]);
    return { inProgress, purchaseConfirmPending, reviewable, refund };
  }

  async getOrderTabCounts(
    userId: string,
    as: OrderListAs,
  ): Promise<ClientOrderTabCountsDto | ExpertOrderTabCountsDto> {
    const field = ORDER_LIST_USER_ID_FIELD[as];
    const groups = ORDER_TAB_STATUSES[as];
    const count = (statuses?: OrderStatus[]): Promise<number> =>
      this.ordersRepository.countOrdersByUser({ userId, field, statuses });

    if (as === ORDER_LIST_AS.EXPERT) {
      const g = groups as (typeof ORDER_TAB_STATUSES)['expert'];
      const [
        all,
        working,
        workCompleted,
        purchaseConfirmed,
        settlement,
        expired,
        cancelRefund,
      ] = await Promise.all([
        count(),
        count(g.working),
        count(g.workCompleted),
        count(g.purchaseConfirmed),
        count(g.settlement),
        count(g.expired),
        count(g.cancelRefund),
      ]);
      return {
        all,
        working,
        workCompleted,
        purchaseConfirmed,
        settlement,
        expired,
        cancelRefund,
      };
    }

    const g = groups as (typeof ORDER_TAB_STATUSES)['client'];
    const [
      all,
      working,
      workCompleted,
      purchaseConfirmed,
      deadlineImminent,
      expired,
      cancelRefund,
    ] = await Promise.all([
      count(),
      count(g.working),
      count(g.workCompleted),
      count(g.purchaseConfirmed),
      count(g.deadlineImminent),
      count(g.expired),
      count(g.cancelRefund),
    ]);
    return {
      all,
      working,
      workCompleted,
      purchaseConfirmed,
      deadlineImminent,
      expired,
      cancelRefund,
    };
  }

  async getScheduleTabCounts(
    userId: string,
    as: OrderListAs,
  ): Promise<ScheduleTabCountsResponseDto> {
    const field = ORDER_LIST_USER_ID_FIELD[as];
    const count = (statuses: OrderStatus[]): Promise<number> =>
      this.ordersRepository.countOrdersByUser({ userId, field, statuses });

    const [all, inProgress, workCompleted, deadlineImminent, expired] =
      await Promise.all([
        count(SCHEDULE_LIST_STATUSES),
        count(SCHEDULE_TAB_STATUSES.inProgress),
        count(SCHEDULE_TAB_STATUSES.workCompleted),
        count(SCHEDULE_TAB_STATUSES.deadlineImminent),
        count(SCHEDULE_TAB_STATUSES.expired),
      ]);

    return { all, inProgress, workCompleted, deadlineImminent, expired };
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

      const kstDate = toKstDate(new Date());
      this.ordersRepository
        .upsertStatistics({
          sellerUserId: service.expertUserId,
          serviceGroupId: service.serviceGroupId,
          serviceCategoryId: service.serviceCategoryId,
          agreedServicePrice,
          date: kstDate,
        })
        .catch((error: unknown) => {
          this.logger.error(
            `통계 upsert 실패. orderId=${dto.orderId}`,
            error instanceof Error ? error.stack : String(error),
          );
        });

      if (dto.roomId) {
        const roomId = dto.roomId;
        void (async () => {
          try {
            await this.chatService.sendSystemMessage(
              roomId,
              'PAYMENT_COMPLETED',
              {
                systemType: 'PAYMENT_COMPLETED',
                serviceTitle: service.title,
                servicePrice: agreedServicePrice,
                platformFee,
                totalAmount,
                expertSettlementAmount: agreedServicePrice,
              },
              dto.orderId,
            );
            await this.chatService.sendSystemMessage(
              roomId,
              'PAYMENT_HELD',
              { systemType: 'PAYMENT_HELD' },
              dto.orderId,
            );
            await this.chatService.sendSystemMessage(
              roomId,
              'SCHEDULE_REQUEST',
              { systemType: 'SCHEDULE_REQUEST' },
              dto.orderId,
            );
          } catch (error: unknown) {
            this.logger.error(
              `결제 후 시스템 메시지 발송 실패. orderId=${dto.orderId}`,
              error instanceof Error ? error.stack : String(error),
            );
          }
        })();
      }

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
    const now = new Date();

    if (endDate <= now) throw new AppException(ORDER_ERRORS.INVALID_END_DATE);

    const isDeadlineImminent =
      endDate <= new Date(now.getTime() + DEADLINE_IMMINENT_DAYS * MS_PER_DAY);

    let toStatus: OrderStatus | undefined;
    if (order.status === OrderStatus.NEGOTIATING && order.endDate === null) {
      toStatus = OrderStatus.IN_PROGRESS;
    } else if (
      order.status === OrderStatus.DEADLINE_IMMINENT ||
      order.status === OrderStatus.EXPIRED
    ) {
      toStatus = isDeadlineImminent
        ? OrderStatus.DEADLINE_IMMINENT
        : OrderStatus.IN_PROGRESS;
    }

    const updated = await this.ordersRepository.updateOrderSchedule({
      orderId,
      fromStatus: order.status,
      endDate,
      toStatus,
    });

    if (!updated) throw new AppException(ORDER_ERRORS.INVALID_STATUS);

    // 등록·변경 모두 SCHEDULE_REGISTERED 발송.
    // - 변경 시: 직전 SCHEDULE_CHANGE_REQUEST '대기'를 해제 → 일정관리 '일정변경' 버튼 사라짐.
    // - 이후 판매자가 재요청하면 새 SCHEDULE_CHANGE_REQUEST가 최신이 되어 다시 대기 → 버튼 부활.
    // 목록 refetch 레이스 방지를 위해 응답 전에 await (발송 실패해도 일정 업데이트는 성공 처리).
    if (dto.roomId) {
      try {
        await this.chatService.sendSystemMessage(
          dto.roomId,
          'SCHEDULE_REGISTERED',
          {
            systemType: 'SCHEDULE_REGISTERED',
            serviceTitle: order.service.title,
            startDate: order.startDate?.toISOString() ?? '',
            endDate: endDate.toISOString(),
          },
          orderId,
        );
      } catch (error: unknown) {
        this.logger.error(
          `일정 등록/변경 시스템 메시지 발송 실패. orderId=${orderId}`,
          error instanceof Error ? error.stack : String(error),
        );
      }
    }

    return mapUpdateOrderScheduleResponse(updated);
  }

  async requestScheduleChange(
    userId: string,
    orderId: string,
    dto: ScheduleChangeRequestDto,
  ) {
    const order =
      await this.ordersRepository.findOrderForScheduleChangeRequest(orderId);
    if (!order) throw new AppException(ORDER_ERRORS.NOT_FOUND);
    if (order.expertUserId !== userId)
      throw new AppException(ORDER_ERRORS.FORBIDDEN_NOT_OWNER);
    if (
      order.status !== OrderStatus.NEGOTIATING &&
      order.status !== OrderStatus.IN_PROGRESS &&
      order.status !== OrderStatus.DEADLINE_IMMINENT &&
      order.status !== OrderStatus.EXPIRED
    ) {
      throw new AppException(ORDER_ERRORS.INVALID_STATUS);
    }

    if (dto.roomId) {
      void this.chatService
        .sendSystemMessage(
          dto.roomId,
          'SCHEDULE_CHANGE_REQUEST',
          {
            systemType: 'SCHEDULE_CHANGE_REQUEST',
            serviceTitle: order.service.title,
            clientName:
              order.clientUser.clientProfile?.nickname ??
              order.clientUser.name ??
              '',
            expertBusinessName:
              order.expertUser.expertProfile?.businessName ?? '',
          },
          orderId,
        )
        .catch((error: unknown) => {
          this.logger.error(
            `일정변경요청 시스템 메시지 발송 실패. orderId=${orderId}`,
            error instanceof Error ? error.stack : String(error),
          );
        });
    }

    return {};
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

  async getOrderReview(
    userId: string,
    orderId: string,
  ): Promise<OrderReviewResponseDto> {
    const order = await this.ordersRepository.findOrderForReview(orderId);
    if (order === null) throw new AppException(ORDER_ERRORS.NOT_FOUND);
    if (order.clientUserId !== userId)
      throw new AppException(ORDER_ERRORS.FORBIDDEN_NOT_OWNER);
    if (order.review === null) throw new AppException(REVIEW_ERRORS.NOT_FOUND);

    return order.review;
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

    const updated = await this.ordersRepository.updateReview(
      reviewId,
      review.order.expertUserId,
      { rating: dto.rating, content: dto.content },
    );

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

    await this.ordersRepository.deleteReview(
      reviewId,
      review.order.expertUserId,
    );
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

  async approveCancelOrder(
    expertUserId: string,
    orderId: string,
    roomId?: string,
  ) {
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

      if (roomId) {
        void this.chatService
          .sendSystemMessage(
            roomId,
            'TRADE_CANCELED',
            {
              systemType: 'TRADE_CANCELED',
              serviceTitle: order.service.title,
              servicePrice: order.agreedServicePrice,
              platformFee: order.platformFee,
              totalAmount: order.totalAmount,
              expertSettlementAmount: order.agreedServicePrice,
            },
            orderId,
          )
          .catch((error: unknown) => {
            this.logger.error(
              `거래취소 시스템 메시지 발송 실패. orderId=${orderId}`,
              error instanceof Error ? error.stack : String(error),
            );
          });
      }

      const kstDate = toKstDate(order.createdAt);
      this.ordersRepository
        .decrementStatistics({
          sellerUserId: order.expertUserId,
          serviceGroupId: order.service.serviceGroupId,
          serviceCategoryId: order.service.serviceCategoryId,
          agreedServicePrice: order.agreedServicePrice,
          date: kstDate,
        })
        .catch((error: unknown) => {
          this.logger.error(
            `통계 decrement 실패. orderId=${orderId}`,
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

      const kstDate = toKstDate(order.createdAt);
      this.ordersRepository
        .decrementStatistics({
          sellerUserId: order.expertUserId,
          serviceGroupId: order.service.serviceGroupId,
          serviceCategoryId: order.service.serviceCategoryId,
          agreedServicePrice: order.agreedServicePrice,
          date: kstDate,
        })
        .catch((error: unknown) => {
          this.logger.error(
            `통계 decrement 실패. orderId=${orderId}`,
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
