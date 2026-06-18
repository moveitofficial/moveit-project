import { Injectable } from '@nestjs/common';
import { NotificationType } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { NotificationTab } from './notification-tab.enum';

import type { Notification, Prisma } from '@prisma/client';

@Injectable()
export class NotificationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  createMany(data: Prisma.NotificationCreateManyInput[]) {
    return this.prisma.notification.createMany({ data });
  }

  findManyByUserId(
    userId: string,
    tab: NotificationTab,
    skip: number,
    take: number,
  ): Promise<Notification[]> {
    const typeFilter: Prisma.NotificationWhereInput =
      tab === NotificationTab.TRANSACTION
        ? { type: NotificationType.TRANSACTION }
        : {
            type: {
              in: [
                NotificationType.COMMUNITY,
                NotificationType.REMINDER,
                NotificationType.ACCOUNT,
              ],
            },
          };

    return this.prisma.notification.findMany({
      where: { userId, isDeleted: false, ...typeFilter },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  async hasUnreadByUserId(userId: string): Promise<boolean> {
    const found = await this.prisma.notification.findFirst({
      where: { userId, isRead: false, isDeleted: false },
      select: { id: true },
    });
    return found !== null;
  }

  async markAsRead(id: string, userId: string): Promise<number> {
    const result = await this.prisma.notification.updateMany({
      where: { id, userId, isDeleted: false },
      data: { isRead: true },
    });
    return result.count;
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false, isDeleted: false },
      data: { isRead: true },
    });
  }

  async softDelete(id: string, userId: string): Promise<number> {
    const result = await this.prisma.notification.updateMany({
      where: { id, userId, isDeleted: false },
      data: { isDeleted: true, deletedAt: new Date() },
    });
    return result.count;
  }

  async softDeleteAll(userId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { userId, isDeleted: false },
      data: { isDeleted: true, deletedAt: new Date() },
    });
  }
}
