import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationCategory, OrderStatus } from '@prisma/client';

import { NotificationsService } from '../notifications/notifications.service';

import { OrdersRepository } from './orders.repository';

const DEADLINE_IMMINENT_DAYS = 3;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

@Injectable()
export class OrdersCron {
  private readonly logger = new Logger(OrdersCron.name);

  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { timeZone: 'Asia/Seoul' })
  async runDailyChecks(): Promise<void> {
    this.logger.log('일일 주문 마감 체크 시작');
    await this.markDeadlineImminent();
    await this.markExpired();
    this.logger.log('일일 주문 마감 체크 종료');
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
