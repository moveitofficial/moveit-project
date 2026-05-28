import { Injectable } from '@nestjs/common';

import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { toPaginatedResponse } from '../../common/utils/list-response.util';

import { AdminDashboardRepository } from './admin-dashboard.repository';
import {
  CS_TARGET_ACTIONS,
  FAQ_TARGET_ACTIONS,
  type Paginated,
  PendingType,
  USER_TARGET_ACTIONS,
} from './admin-dashboard.types';
import { ActivityItemDto } from './dto/activities-response.dto';
import { PendingItemDto } from './dto/pending-response.dto';
import { SummaryResponseDataDto } from './dto/summary-response.dto';

@Injectable()
export class AdminDashboardService {
  constructor(
    private readonly adminDashboardRepository: AdminDashboardRepository,
  ) {}

  async getSummary(): Promise<SummaryResponseDataDto> {
    const [expertApplications, reports, settlements, ongoingServices] =
      await Promise.all([
        this.adminDashboardRepository.countPendingExpertApplications(),
        this.adminDashboardRepository.countPendingReports(),
        this.adminDashboardRepository.countSettlementRequests(),
        this.adminDashboardRepository.countOngoingServices(),
      ]);

    return {
      expertApplications,
      reports,
      settlements,
      ongoingServices,
    };
  }

  async getPending(
    query: PaginationQueryDto,
  ): Promise<Paginated<PendingItemDto>> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;

    // 1. 4 도메인 처리대기 항목 전체 동시 조회
    const [experts, reports, csChats, settlements] = await Promise.all([
      this.adminDashboardRepository.findPendingExpertApplications(),
      this.adminDashboardRepository.findPendingReports(),
      this.adminDashboardRepository.findPendingCsChats(),
      this.adminDashboardRepository.findPendingSettlements(),
    ]);

    // 2. 공통 PendingItem 형태로 매핑
    const items: PendingItemDto[] = [
      ...experts.map((e) => ({
        type: PendingType.EXPERT_APPLICATION,
        id: e.id,
        content: `${e.user.name ?? '이름없음'} 판매자 권한 신청`,
        requesterName: e.user.name ?? '이름없음',
        createdAt: e.createdAt,
      })),
      ...reports.map((r) => ({
        type: PendingType.REPORT,
        id: r.id,
        content: r.detail,
        requesterName: r.reporter.name ?? '이름없음',
        createdAt: r.createdAt,
      })),
      ...csChats.map((c) => ({
        type: PendingType.CS,
        id: c.id,
        content: c.messages[0]?.content ?? 'CS 문의',
        requesterName: c.user.name ?? '이름없음',
        createdAt: c.createdAt,
      })),
      ...settlements.map((o) => ({
        type: PendingType.SETTLEMENT,
        id: o.id,
        content: `${o.expertUser.name ?? '이름없음'} 판매자 정산요청`,
        requesterName: o.expertUser.name ?? '이름없음',
        createdAt: o.createdAt,
      })),
    ];

    // 3. 시간 desc 정렬
    items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // 4. offset 페이지네이션
    const totalCount = items.length;
    const offset = (page - 1) * pageSize;
    const sliced = items.slice(offset, offset + pageSize);

    return toPaginatedResponse(sliced, { page, pageSize, totalCount });
  }

  async getActivities(
    query: PaginationQueryDto,
  ): Promise<Paginated<ActivityItemDto>> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const skip = (page - 1) * pageSize;

    const [rows, totalCount] = await Promise.all([
      this.adminDashboardRepository.findActivities(skip, pageSize),
      this.adminDashboardRepository.countActivities(),
    ]);

    // referenceId를 카테고리별로 묶어서 한 번에 batch 조회 → N+1 회피
    const userIds: string[] = [];
    const faqIds: string[] = [];
    const csIds: string[] = [];
    for (const r of rows) {
      if (r.referenceId === null) continue;
      if (USER_TARGET_ACTIONS.has(r.actionType)) {
        userIds.push(r.referenceId);
      } else if (FAQ_TARGET_ACTIONS.has(r.actionType)) {
        faqIds.push(r.referenceId);
      } else if (CS_TARGET_ACTIONS.has(r.actionType)) {
        csIds.push(r.referenceId);
      }
    }

    const [users, faqs, csRooms] = await Promise.all([
      this.adminDashboardRepository.findUsersByIds(userIds),
      this.adminDashboardRepository.findFaqsByIds(faqIds),
      this.adminDashboardRepository.findCsChatRoomsByIds(csIds),
    ]);

    const userNameMap = new Map(users.map((u) => [u.id, u.name]));
    const faqTitleMap = new Map(faqs.map((f) => [f.id, f.title]));
    const csUserNameMap = new Map(csRooms.map((c) => [c.id, c.user.name]));

    const items: ActivityItemDto[] = rows.map((r) => {
      let targetName: string | null = null;
      if (r.referenceId !== null) {
        if (USER_TARGET_ACTIONS.has(r.actionType)) {
          targetName = userNameMap.get(r.referenceId) ?? null;
        } else if (FAQ_TARGET_ACTIONS.has(r.actionType)) {
          targetName = faqTitleMap.get(r.referenceId) ?? null;
        } else if (CS_TARGET_ACTIONS.has(r.actionType)) {
          targetName = csUserNameMap.get(r.referenceId) ?? null;
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
