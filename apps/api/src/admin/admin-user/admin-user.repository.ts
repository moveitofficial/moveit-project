import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import type { GetUsersQueryDto } from './dto/users-query.dto';
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
}
