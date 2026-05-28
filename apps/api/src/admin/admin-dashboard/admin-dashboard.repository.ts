import { Injectable } from '@nestjs/common';
import {
  CsChatStatus,
  OrderStatus,
  ReportStatus,
  SenderType,
} from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminDashboardRepository {
  constructor(private readonly prisma: PrismaService) {}

  // 전문가 신청 대기: 신청 상태(isApplied=true)이면서 아직 승인 안 됨(isApproved=false).
  // rejectedAt은 보지 않음 — 거절 이력이 있어도 재신청 시 isApplied가 다시 true가 되므로.
  countPendingExpertApplications(): Promise<number> {
    return this.prisma.expertProfile.count({
      where: { isApplied: true, isApproved: false },
    });
  }

  // 신고 처리 대기: 어드민이 아직 처리하지 않은 신고. 처리 완료(COMPLETED)는 제외.
  countPendingReports(): Promise<number> {
    return this.prisma.report.count({
      where: { status: ReportStatus.PENDING },
    });
  }

  // 정산 요청 대기: 전문가가 정산을 요청해서 어드민 승인을 기다리는 주문.
  // 흐름상 PURCHASE_CONFIRMED → SETTLEMENT_REQUESTED → SETTLEMENT_COMPLETED 사이의 단계.
  countSettlementRequests(): Promise<number> {
    return this.prisma.order.count({
      where: { status: OrderStatus.SETTLEMENT_REQUESTED },
    });
  }

  // 서비스 진행중: 계약 협의~작업 완료(구매확정 대기)까지의 전 구간. 정산·환불 단계는 제외.
  // status `in` 연산자 = SQL의 IN, 나열된 값 중 하나라도 매칭되면 카운트.
  countOngoingServices(): Promise<number> {
    return this.prisma.order.count({
      where: {
        status: {
          in: [
            OrderStatus.NEGOTIATING,
            OrderStatus.IN_PROGRESS,
            OrderStatus.DEADLINE_IMMINENT,
            OrderStatus.WORK_COMPLETED,
          ],
        },
      },
    });
  }

  // 처리대기 4 도메인: 페이지네이션은 Service에서 머지 후 slice — Repository는 전체 반환
  findPendingExpertApplications() {
    return this.prisma.expertProfile.findMany({
      where: { isApplied: true, isApproved: false },
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } } },
    });
  }

  findPendingReports() {
    return this.prisma.report.findMany({
      where: { status: ReportStatus.PENDING },
      orderBy: { createdAt: 'desc' },
      include: { reporter: { select: { name: true } } },
    });
  }

  findPendingCsChats() {
    return this.prisma.csChatRoom.findMany({
      where: { status: CsChatStatus.OPEN },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true } },
        messages: {
          where: { senderType: SenderType.USER },
          orderBy: { createdAt: 'asc' },
          take: 1,
          select: { content: true },
        },
      },
    });
  }

  findPendingSettlements() {
    return this.prisma.order.findMany({
      where: { status: OrderStatus.SETTLEMENT_REQUESTED },
      orderBy: { createdAt: 'desc' },
      include: { expertUser: { select: { name: true } } },
    });
  }

  // ─── Admin activity logs (offset 페이지네이션) ─────────
  countActivities(): Promise<number> {
    return this.prisma.adminActivityLog.count();
  }

  findActivities(skip: number, take: number) {
    return this.prisma.adminActivityLog.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: { admin: { select: { name: true } } },
    });
  }

  // 활동 로그 enrich용 batch 조회 — referenceId 묶음으로 한 번에
  findUsersByIds(ids: string[]) {
    if (ids.length === 0) return Promise.resolve([]);
    return this.prisma.user.findMany({
      where: { id: { in: ids } },
      select: { id: true, name: true },
    });
  }

  findFaqsByIds(ids: string[]) {
    if (ids.length === 0) return Promise.resolve([]);
    return this.prisma.faq.findMany({
      where: { id: { in: ids } },
      select: { id: true, title: true },
    });
  }

  findCsChatRoomsByIds(ids: string[]) {
    if (ids.length === 0) return Promise.resolve([]);
    return this.prisma.csChatRoom.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        user: { select: { name: true } },
      },
    });
  }
}
