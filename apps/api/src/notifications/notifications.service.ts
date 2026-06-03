import { Injectable } from '@nestjs/common';

import { NOTIFICATION_ERRORS } from '../common/constants/errors';
import { AppException } from '../common/exceptions/app.exception';

import { NOTIFICATION_CATALOG } from './notification.catalog';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsRepository } from './notifications.repository';

import type { NotificationTab } from './notification-tab.enum';
import type { NotificationContentVars } from './notification.catalog';
import type { Notification, NotificationCategory } from '@prisma/client';

const PAGE_SIZE = 10;

interface SendParams {
  userIds: string[];
  category: NotificationCategory;
  vars?: NotificationContentVars;
  referenceId?: string | null;
}

interface ListResult {
  items: Notification[];
  hasNext: boolean;
}

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async send({
    userIds,
    category,
    vars,
    referenceId,
  }: SendParams): Promise<void> {
    if (userIds.length === 0) return;

    const meta = NOTIFICATION_CATALOG[category];
    const content = meta.buildContent(vars);

    const data = userIds.map((userId) => ({
      userId,
      type: meta.type,
      category,
      content,
      referenceType: meta.referenceType,
      referenceId: referenceId ?? null,
    }));

    await this.notificationsRepository.createMany(data);

    for (const userId of userIds) {
      this.notificationsGateway.emitNewNotification(userId);
    }
  }

  async list(
    userId: string,
    tab: NotificationTab,
    page: number,
  ): Promise<ListResult> {
    const skip = (page - 1) * PAGE_SIZE;
    const take = PAGE_SIZE + 1;

    const rows = await this.notificationsRepository.findManyByUserId(
      userId,
      tab,
      skip,
      take,
    );
    const hasNext = rows.length > PAGE_SIZE;
    const items = hasNext ? rows.slice(0, PAGE_SIZE) : rows;

    return { items, hasNext };
  }

  hasUnread(userId: string): Promise<boolean> {
    return this.notificationsRepository.hasUnreadByUserId(userId);
  }

  async markAsRead(id: string, userId: string): Promise<void> {
    const count = await this.notificationsRepository.markAsRead(id, userId);
    if (count === 0) {
      throw new AppException(NOTIFICATION_ERRORS.NOT_FOUND);
    }
  }

  markAllAsRead(userId: string): Promise<void> {
    return this.notificationsRepository.markAllAsRead(userId);
  }

  async softDelete(id: string, userId: string): Promise<void> {
    const count = await this.notificationsRepository.softDelete(id, userId);
    if (count === 0) {
      throw new AppException(NOTIFICATION_ERRORS.NOT_FOUND);
    }
  }

  softDeleteAll(userId: string): Promise<void> {
    return this.notificationsRepository.softDeleteAll(userId);
  }
}
