import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationCategory, OrderStatus } from '@prisma/client';

import { ChatService } from '../chats/chat/chat.service';
import { NotificationsService } from '../notifications/notifications.service';

import {
  DEADLINE_IMMINENT_DAYS,
  MS_PER_DAY,
  PENDING_EXPIRY_DAYS,
} from './orders.constants';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersCron {
  private readonly logger = new Logger(OrdersCron.name);

  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly notificationsService: NotificationsService,
    private readonly chatService: ChatService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { timeZone: 'Asia/Seoul' })
  async runDailyChecks(): Promise<void> {
    this.logger.log('일일 주문 마감 체크 시작');
    await this.markTradeRequestExpired();
    await this.markDeadlineImminent();
    await this.markExpired();
    this.logger.log('일일 주문 마감 체크 종료');
  }

  private async markTradeRequestExpired(): Promise<void> {
    const threshold = new Date(Date.now() - PENDING_EXPIRY_DAYS * MS_PER_DAY);
    const orders =
      await this.ordersRepository.findOrdersToPendingExpiry(threshold);
    if (orders.length === 0) {
      this.logger.log('거래요청 만료 처리 대상 없음');
      return;
    }

    const orderIds = orders.map((o) => o.id);
    await this.ordersRepository.updateOrdersStatus(
      orderIds,
      OrderStatus.TRADE_REQUEST_EXPIRED,
    );

    const roomMap = await this.ordersRepository.findRoomIdsByOrderIds(orderIds);

    for (const order of orders) {
      const roomId = roomMap.get(order.id);
      if (!roomId) continue;

      await this.chatService.sendSystemMessage(
        roomId,
        'TRADE_REQUEST_EXPIRED',
        {
          systemType: 'TRADE_REQUEST_EXPIRED',
          serviceTitle: order.service.title,
          servicePrice: order.agreedServicePrice,
          platformFee: order.platformFee,
          totalAmount: order.totalAmount,
          expertSettlementAmount: order.agreedServicePrice - order.platformFee,
        },
        order.id,
      );
    }

    this.logger.log(`거래요청 만료 처리 ${orders.length.toString()}건`);
  }

  private async markDeadlineImminent(): Promise<void> {
    const now = new Date();
    const threshold = new Date(
      now.getTime() + DEADLINE_IMMINENT_DAYS * MS_PER_DAY,
    );

    const orders = await this.ordersRepository.findOrdersToImminent(
      now,
      threshold,
    );
    if (orders.length === 0) {
      this.logger.log('마감임박 처리 대상 없음');
      return;
    }

    await this.ordersRepository.updateOrdersStatus(
      orders.map((o) => o.id),
      OrderStatus.DEADLINE_IMMINENT,
    );

    for (const order of orders) {
      await this.notificationsService.send({
        userIds: [order.clientUserId, order.expertUserId],
        category: NotificationCategory.DEADLINE_REMINDER,
        vars: { serviceTitle: order.service.title },
        referenceId: order.id,
      });
    }

    this.logger.log(`마감임박 처리 ${orders.length.toString()}건`);
  }

  private async markExpired(): Promise<void> {
    const now = new Date();
    const orders = await this.ordersRepository.findOrdersToExpire(now);
    if (orders.length === 0) {
      this.logger.log('기한만료 처리 대상 없음');
      return;
    }

    await this.ordersRepository.updateOrdersStatus(
      orders.map((o) => o.id),
      OrderStatus.EXPIRED,
    );

    for (const order of orders) {
      await this.notificationsService.send({
        userIds: [order.clientUserId, order.expertUserId],
        category: NotificationCategory.DEADLINE_EXPIRED,
        vars: { serviceTitle: order.service.title },
        referenceId: order.id,
      });
    }

    this.logger.log(`기한만료 처리 ${orders.length.toString()}건`);
  }
}
