import { Injectable } from '@nestjs/common';
import { AdminActionType, Prisma, Role } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

import { ExpertApprovalStatus } from './dto/list/expert-approval-status.enum';

import type { GetUsersQueryDto } from './dto/list/users-query.dto';
import type { ServiceGroupName } from '@prisma/client';

@Injectable()
export class AdminUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  countUsers(query: GetUsersQueryDto): Promise<number> {
    return this.prisma.user.count({ where: this.#buildWhere(query) });
  }

  findUsers(query: GetUsersQueryDto, skip: number, take: number) {
    return this.prisma.user.findMany({
      where: this.#buildWhere(query),
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        provider: true,
        region: true,
        createdAt: true,
        _count: {
          select: {
            ordersAsClient: true,
            ordersAsExpert: true,
            receivedReports: true,
          },
        },
        expertProfile: {
          select: {
            businessName: true,
            isApplied: true,
            isApproved: true,
            rejectedAt: true,
            specialtyCategories: {
              select: { serviceGroup: { select: { name: true } } },
            },
          },
        },
      },
    });
  }

  // 베이스(role, isDeleted=false 즉 탈퇴 회원 제외)는 항상 / optional 필터는 값 있을 때만 합성
  // role=EXPERT 일 때만 status·specialtyGroup 이 expertProfile 조건으로 합성됨
  #buildWhere(query: GetUsersQueryDto): Prisma.UserWhereInput {
    const { role, provider, region, search, status, specialtyGroup } = query;
    const expertProfileWhere = this.#buildExpertProfileWhere(
      role,
      status,
      specialtyGroup,
    );

    return {
      role,
      isDeleted: false,
      ...(provider && { provider }),
      ...(region && { region }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(expertProfileWhere && { expertProfile: expertProfileWhere }),
    };
  }

  #buildExpertProfileWhere(
    role: Role | undefined,
    status: ExpertApprovalStatus | undefined,
    specialtyGroup: ServiceGroupName | undefined,
  ): Prisma.ExpertProfileWhereInput | null {
    if (role !== Role.EXPERT) return null;
    if (!status && !specialtyGroup) return null;

    const where: Prisma.ExpertProfileWhereInput = {};

    if (status === ExpertApprovalStatus.PENDING) {
      where.isApplied = true;
      where.isApproved = false;
      where.rejectedAt = null;
    } else if (status === ExpertApprovalStatus.APPROVED) {
      where.isApproved = true;
    } else if (status === ExpertApprovalStatus.REJECTED) {
      where.rejectedAt = { not: null };
    }

    if (specialtyGroup) {
      where.specialtyCategories = {
        some: { serviceGroup: { name: specialtyGroup } },
      };
    }

    return where;
  }

  countByRole(role: Role): Promise<number> {
    return this.prisma.user.count({
      where: { role, isDeleted: false },
    });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        blockedByAdmin: { select: { name: true } },
        clientProfile: {
          include: {
            interestCategories: {
              include: {
                serviceGroup: { select: { name: true } },
                serviceCategory: { select: { name: true } },
              },
            },
          },
        },
        expertProfile: {
          include: {
            approvedByAdmin: { select: { name: true } },
            specialtyCategories: {
              include: {
                serviceGroup: { select: { name: true } },
                serviceCategory: { select: { name: true } },
              },
            },
            techStacks: {
              include: {
                techStack: { select: { name: true } },
              },
            },
            portfolios: {
              orderBy: { createdAt: 'desc' },
              select: {
                id: true,
                title: true,
                images: {
                  where: { isMain: true },
                  take: 1,
                  select: { imgUrl: true },
                },
              },
            },
          },
        },
      },
    });
  }

  // role 검증 가벼운 확인용
  findRoleById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });
  }

  // orders (CLIENT 구매내역)
  findOrdersByClientId(clientUserId: string, skip: number, take: number) {
    return this.prisma.order.findMany({
      where: { clientUserId },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        status: true,
        totalAmount: true,
        platformFee: true,
        endDate: true,
        createdAt: true,
        service: { select: { id: true, title: true } },
        expertUser: { select: { id: true, name: true } },
        payment: {
          select: {
            refund: {
              select: { type: true, status: true },
            },
          },
        },
      },
    });
  }

  countOrdersByClientId(clientUserId: string): Promise<number> {
    return this.prisma.order.count({ where: { clientUserId } });
  }

  // services (EXPERT 등록 서비스)
  findServicesByExpertId(expertUserId: string, skip: number, take: number) {
    return this.prisma.service.findMany({
      where: { expertUserId },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        status: true,
        servicePrice: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
    });
  }

  countServicesByExpertId(expertUserId: string): Promise<number> {
    return this.prisma.service.count({ where: { expertUserId } });
  }

  // ─── reports received (신고받은) ─────────────────────────
  findReportsReceivedByUserId(userId: string, skip: number, take: number) {
    return this.prisma.report.findMany({
      where: { reportedId: userId },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        detail: true,
        reason: true,
        createdAt: true,
        reporter: { select: { id: true, name: true } },
      },
    });
  }

  countReportsReceivedByUserId(userId: string): Promise<number> {
    return this.prisma.report.count({ where: { reportedId: userId } });
  }

  // ─── reports sent (신고한) ───────────────────────────────
  findReportsSentByUserId(userId: string, skip: number, take: number) {
    return this.prisma.report.findMany({
      where: { reporterId: userId },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        detail: true,
        reason: true,
        createdAt: true,
        reported: { select: { id: true, name: true } },
      },
    });
  }

  countReportsSentByUserId(userId: string): Promise<number> {
    return this.prisma.report.count({ where: { reporterId: userId } });
  }

  // ─── posts (게시글) ──────────────────────────────────────
  findPostsByUserId(userId: string, skip: number, take: number) {
    return this.prisma.communityPost.findMany({
      where: { userId },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        deletedAt: true,
        deletedByAdminId: true,
        createdAt: true,
        deletedByAdmin: { select: { name: true } },
      },
    });
  }

  countPostsByUserId(userId: string): Promise<number> {
    return this.prisma.communityPost.count({ where: { userId } });
  }

  // ─── comments (댓글) ─────────────────────────────────────
  findCommentsByUserId(userId: string, skip: number, take: number) {
    return this.prisma.comment.findMany({
      where: { userId },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        content: true,
        deletedAt: true,
        deletedByAdminId: true,
        createdAt: true,
        deletedByAdmin: { select: { name: true } },
      },
    });
  }

  countCommentsByUserId(userId: string): Promise<number> {
    return this.prisma.comment.count({ where: { userId } });
  }

  blockUser(
    userId: string,
    adminId: string,
    action:
      | typeof AdminActionType.BLACKLIST_ADDED
      | typeof AdminActionType.BLACKLIST_REMOVED,
  ) {
    const isAdding = action === AdminActionType.BLACKLIST_ADDED;

    return this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: {
          isBlocked: isAdding,
          blockedAt: isAdding ? new Date() : null,
          blockedByAdminId: isAdding ? adminId : null,
        },
      }),
      this.prisma.adminActivityLog.create({
        data: {
          adminId,
          actionType: action,
          referenceId: userId,
        },
      }),
    ]);
  }

  approveExpert(userId: string, adminId: string) {
    return this.prisma.$transaction([
      this.prisma.expertProfile.update({
        where: { userId },
        data: {
          isApproved: true,
          approvedAt: new Date(),
          approvedByAdminId: adminId,
          rejectedAt: null,
          rejectReason: null,
        },
      }),
      this.prisma.adminActivityLog.create({
        data: {
          adminId,
          actionType: AdminActionType.EXPERT_APPROVED,
          referenceId: userId,
        },
      }),
    ]);
  }

  rejectExpert(userId: string, adminId: string, rejectReason: string) {
    return this.prisma.$transaction([
      this.prisma.expertProfile.update({
        where: { userId },
        data: { isApplied: false, rejectedAt: new Date(), rejectReason },
      }),
      this.prisma.adminActivityLog.create({
        data: {
          adminId,
          actionType: AdminActionType.EXPERT_REJECTED,
          referenceId: userId,
        },
      }),
    ]);
  }
}
