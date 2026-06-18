import { Injectable } from '@nestjs/common';

import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { type Paginated } from '../../common/types/paginated.type';
import { toPaginatedResponse } from '../../common/utils/list-response.util';
import { AdminActivityService } from '../admin-activity/admin-activity.service';
import { ActivityItemDto } from '../admin-activity/dto/activity-item.dto';

import { AdminDashboardRepository } from './admin-dashboard.repository';
import { PendingType } from './admin-dashboard.types';
import { PendingItemDto } from './dto/pending-response.dto';
import { SummaryResponseDataDto } from './dto/summary-response.dto';

@Injectable()
export class AdminDashboardService {
  constructor(
    private readonly adminDashboardRepository: AdminDashboardRepository,
    private readonly adminActivityService: AdminActivityService,
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

  getActivities(
    query: PaginationQueryDto,
  ): Promise<Paginated<ActivityItemDto>> {
    return this.adminActivityService.getActivities({
      page: query.page,
      pageSize: query.pageSize,
    });
  }
}
