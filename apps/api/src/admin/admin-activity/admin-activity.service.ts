import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { type Paginated } from '../../common/types/paginated.type';
import { toPaginatedResponse } from '../../common/utils/list-response.util';
import { PrismaService } from '../../prisma/prisma.service';

import {
  CS_TARGET_ACTIONS,
  FAQ_TARGET_ACTIONS,
  MAIN_SECTION_LABELS,
  MAIN_TARGET_ACTIONS,
  ORDER_TARGET_ACTIONS,
  USER_TARGET_ACTIONS,
} from './admin-activity.types';
import { ActivityItemDto } from './dto/activity-item.dto';

@Injectable()
export class AdminActivityService {
  constructor(private readonly prisma: PrismaService) {}

  async getActivities(params: {
    adminId?: string;
    page?: number;
    pageSize?: number;
  }): Promise<Paginated<ActivityItemDto>> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    const skip = (page - 1) * pageSize;

    const where: Prisma.AdminActivityLogWhereInput = params.adminId
      ? { adminId: params.adminId }
      : {};

    const [rows, totalCount] = await Promise.all([
      this.prisma.adminActivityLog.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: { admin: { select: { name: true } } },
      }),
      this.prisma.adminActivityLog.count({ where }),
    ]);

    // referenceId를 카테고리별로 묶어서 한 번에 batch 조회 → N+1 회피
    const userIds: string[] = [];
    const faqIds: string[] = [];
    const csIds: string[] = [];
    const mainIds: string[] = [];
    const orderIds: string[] = [];
    for (const r of rows) {
      if (r.referenceId === null) continue;
      if (USER_TARGET_ACTIONS.has(r.actionType)) {
        userIds.push(r.referenceId);
      } else if (FAQ_TARGET_ACTIONS.has(r.actionType)) {
        faqIds.push(r.referenceId);
      } else if (CS_TARGET_ACTIONS.has(r.actionType)) {
        csIds.push(r.referenceId);
      } else if (MAIN_TARGET_ACTIONS.has(r.actionType)) {
        mainIds.push(r.referenceId);
      } else if (ORDER_TARGET_ACTIONS.has(r.actionType)) {
        orderIds.push(r.referenceId);
      }
    }

    const [users, faqs, csRooms, mainSettings, orders] = await Promise.all([
      userIds.length === 0
        ? []
        : this.prisma.user.findMany({
            where: { id: { in: userIds } },
            select: { id: true, name: true },
          }),
      faqIds.length === 0
        ? []
        : this.prisma.faq.findMany({
            where: { id: { in: faqIds } },
            select: { id: true, title: true },
          }),
      csIds.length === 0
        ? []
        : this.prisma.csChatRoom.findMany({
            where: { id: { in: csIds } },
            select: { id: true, user: { select: { name: true } } },
          }),
      mainIds.length === 0
        ? []
        : this.prisma.mainSetting.findMany({
            where: { id: { in: mainIds } },
            select: { id: true, sectionType: true },
          }),
      orderIds.length === 0
        ? []
        : this.prisma.order.findMany({
            where: { id: { in: orderIds } },
            select: { id: true, expertUser: { select: { name: true } } },
          }),
    ]);

    const userNameMap = new Map(users.map((u) => [u.id, u.name]));
    const faqTitleMap = new Map(faqs.map((f) => [f.id, f.title]));
    const csUserNameMap = new Map(csRooms.map((c) => [c.id, c.user.name]));
    const mainSectionMap = new Map(
      mainSettings.map((m) => [m.id, MAIN_SECTION_LABELS[m.sectionType]]),
    );
    const orderExpertNameMap = new Map(
      orders.map((o) => [o.id, o.expertUser.name]),
    );

    const items: ActivityItemDto[] = rows.map((r) => {
      let targetName: string | null = null;

      if (r.referenceId !== null) {
        if (USER_TARGET_ACTIONS.has(r.actionType)) {
          targetName = userNameMap.get(r.referenceId) ?? null;
        } else if (FAQ_TARGET_ACTIONS.has(r.actionType)) {
          targetName = faqTitleMap.get(r.referenceId) ?? null;
        } else if (CS_TARGET_ACTIONS.has(r.actionType)) {
          targetName = csUserNameMap.get(r.referenceId) ?? null;
        } else if (MAIN_TARGET_ACTIONS.has(r.actionType)) {
          const label = mainSectionMap.get(r.referenceId);
          targetName = label ? `${label} 노출 수정` : null;
        } else if (ORDER_TARGET_ACTIONS.has(r.actionType)) {
          targetName = orderExpertNameMap.get(r.referenceId) ?? null;
        }
      }
      return {
        id: r.id,
        actionType: r.actionType,
        referenceId: r.referenceId,
        targetName,
        adminName: r.admin.name,
        createdAt: r.createdAt,
      };
    });

    return toPaginatedResponse(items, { page, pageSize, totalCount });
  }
}
