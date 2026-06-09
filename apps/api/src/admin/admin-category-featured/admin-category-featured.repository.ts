import { Injectable } from '@nestjs/common';
import { AdminActionType, Prisma, ServiceGroupName } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminCategoryFeaturedRepository {
  constructor(private readonly prisma: PrismaService) {}

  // 페이지 응답 — 모든 카테고리 대표서비스 + 서비스 풀 정보
  findAll() {
    return this.prisma.categoryFeaturedService.findMany({
      select: {
        id: true,
        serviceGroup: { select: { name: true } },
        service: {
          select: {
            id: true,
            title: true,
            servicePrice: true,
            status: true,
            createdAt: true,
            expertUser: {
              select: {
                expertProfile: {
                  select: { businessName: true },
                },
              },
            },
            _count: {
              select: { orders: true },
            },
          },
        },
      },
    });
  }

  // 후보 모달 — 페이지네이션 + 검색 + 정렬
  findCandidates(params: {
    serviceGroup: ServiceGroupName;
    search: string | undefined;
    sort: 'sales' | 'created';
    skip: number;
    take: number;
  }) {
    const { serviceGroup, search, sort, skip, take } = params;

    return this.prisma.service.findMany({
      where: this.#buildCandidatesWhere(serviceGroup, search),
      skip,
      take,
      orderBy:
        sort === 'sales'
          ? { orders: { _count: 'desc' } }
          : { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        servicePrice: true,
        status: true,
        createdAt: true,
        serviceGroup: { select: { name: true } },
        expertUser: {
          select: {
            expertProfile: {
              select: { businessName: true },
            },
          },
        },
        _count: {
          select: { orders: true },
        },
      },
    });
  }

  countCandidates(params: {
    serviceGroup: ServiceGroupName;
    search: string | undefined;
  }): Promise<number> {
    return this.prisma.service.count({
      where: this.#buildCandidatesWhere(params.serviceGroup, params.search),
    });
  }

  #buildCandidatesWhere(
    serviceGroup: ServiceGroupName,
    search: string | undefined,
  ): Prisma.ServiceWhereInput {
    return {
      serviceGroup: { name: serviceGroup },
      ...(search && { title: { contains: search, mode: 'insensitive' } }),
    };
  }

  // 후보 응답의 registered 필드용 — 해당 그룹에 등록된 서비스 전체 (id + title)
  findRegisteredServicesByGroup(serviceGroup: ServiceGroupName) {
    return this.prisma.categoryFeaturedService
      .findMany({
        where: { serviceGroup: { name: serviceGroup } },
        select: {
          service: { select: { id: true, title: true } },
        },
      })
      .then((rows) => rows.map((r) => r.service));
  }

  // 한도 검증용 — 해당 그룹에 현재 등록된 row 수
  countByGroup(serviceGroup: ServiceGroupName): Promise<number> {
    return this.prisma.categoryFeaturedService.count({
      where: { serviceGroup: { name: serviceGroup } },
    });
  }

  // 중복 등록 방지용 — serviceIds 중 이미 등록된 ID들 반환
  findExistingServiceIdsInGroup(
    serviceGroup: ServiceGroupName,
    serviceIds: string[],
  ): Promise<string[]> {
    return this.prisma.categoryFeaturedService
      .findMany({
        where: {
          serviceGroup: { name: serviceGroup },
          serviceId: { in: serviceIds },
        },
        select: { serviceId: true },
      })
      .then((rows) => rows.map((r) => r.serviceId));
  }

  // group 일치 검증용 — id별 group 매핑
  findServicesByIds(ids: string[]) {
    return this.prisma.service.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        serviceGroup: { select: { name: true } },
      },
    });
  }

  // 삭제 검증용 — categoryFeaturedIds로 row 정보 (존재 + 그룹 일치)
  findCategoryFeaturedByIds(ids: string[]) {
    return this.prisma.categoryFeaturedService.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        serviceGroup: { select: { name: true } },
      },
    });
  }

  // 등록 트랜잭션 — CategoryFeaturedService.create + 활동로그 createMany
  createCategoryFeatured(params: {
    serviceGroup: ServiceGroupName;
    serviceIds: string[];
    adminId: string;
  }): Promise<{ id: string }[]> {
    const { serviceGroup, serviceIds, adminId } = params;

    return this.prisma.$transaction(async (tx) => {
      const created = await Promise.all(
        serviceIds.map((serviceId) =>
          tx.categoryFeaturedService.create({
            data: {
              service: { connect: { id: serviceId } },
              serviceGroup: { connect: { name: serviceGroup } },
            },
            select: { id: true },
          }),
        ),
      );

      await tx.adminActivityLog.createMany({
        data: created.map((row) => ({
          adminId,
          actionType: AdminActionType.MAIN_UPDATED,
          referenceId: row.id,
        })),
      });

      return created;
    });
  }

  // 삭제 트랜잭션 — 활동로그 createMany + CategoryFeaturedService.deleteMany
  deleteCategoryFeatured(params: {
    categoryFeaturedIds: string[];
    adminId: string;
  }): Promise<void> {
    const { categoryFeaturedIds, adminId } = params;

    return this.prisma.$transaction(async (tx) => {
      await tx.adminActivityLog.createMany({
        data: categoryFeaturedIds.map((id) => ({
          adminId,
          actionType: AdminActionType.MAIN_UPDATED,
          referenceId: id,
        })),
      });

      await tx.categoryFeaturedService.deleteMany({
        where: { id: { in: categoryFeaturedIds } },
      });
    });
  }
}
