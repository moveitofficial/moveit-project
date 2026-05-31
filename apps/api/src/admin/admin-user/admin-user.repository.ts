import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import type { GetUsersQueryDto } from './dto/list/users-query.dto';
import type { Prisma, Role } from '@prisma/client';

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
      },
    });
  }

  // 베이스(role, isDeleted=false 즉 탈퇴 회원 제외)는 항상 / optional 필터는 값 있을 때만 합성
  #buildWhere(query: GetUsersQueryDto): Prisma.UserWhereInput {
    const { role, provider, region, search } = query;

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
    };
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
}
