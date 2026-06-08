import { Injectable } from '@nestjs/common';
import {
  AdminActionType,
  MainSectionType,
  MainTargetType,
  Prisma,
  ServiceGroupName,
} from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

const SERVICE_SECTION_TYPES = [
  MainSectionType.POPULAR_IT_COACHING,
  MainSectionType.POPULAR_PROJECT_REQUEST,
  MainSectionType.RECOMMENDED_IT_COACHING,
  MainSectionType.RECOMMENDED_PROJECT_REQUEST,
];

const EXPERT_SECTION_TYPES = [
  MainSectionType.MOVEIT_POPULAR_PROJECT_EXPERT,
  MainSectionType.MOVEIT_POPULAR_COACHING,
];

const SECTION_TO_GROUP: Record<MainSectionType, ServiceGroupName> = {
  POPULAR_IT_COACHING: ServiceGroupName.IT_COACHING,
  POPULAR_PROJECT_REQUEST: ServiceGroupName.PROJECT_REQUEST,
  RECOMMENDED_IT_COACHING: ServiceGroupName.IT_COACHING,
  RECOMMENDED_PROJECT_REQUEST: ServiceGroupName.PROJECT_REQUEST,
  MOVEIT_POPULAR_PROJECT_EXPERT: ServiceGroupName.PROJECT_REQUEST,
  MOVEIT_POPULAR_COACHING: ServiceGroupName.IT_COACHING,
};

@Injectable()
export class AdminMainSettingRepository {
  constructor(private readonly prisma: PrismaService) {}

  findServiceSettings() {
    return this.prisma.mainSetting.findMany({
      where: {
        sectionType: { in: SERVICE_SECTION_TYPES },
        targetServiceId: { not: null },
      },
      select: {
        id: true,
        sectionType: true,
        targetService: {
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
        },
      },
    });
  }

  findExpertSettings() {
    return this.prisma.mainSetting.findMany({
      where: {
        sectionType: { in: EXPERT_SECTION_TYPES },
        targetUserId: { not: null },
      },
      select: {
        id: true,
        sectionType: true,
        targetUser: {
          select: {
            id: true,
            email: true,
            provider: true,
            region: true,
            createdAt: true,
            expertProfile: {
              select: {
                businessName: true,
                isApproved: true,
                specialtyCategories: {
                  select: {
                    serviceGroup: { select: { name: true } },
                  },
                },
              },
            },
            _count: {
              select: {
                ordersAsExpert: true,
                receivedReports: true,
              },
            },
          },
        },
      },
    });
  }

  findBanners() {
    return this.prisma.banner.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        imageUrl: true,
        actionUrl: true,
        createdAt: true,
      },
    });
  }

  findServiceCandidates(params: {
    sectionType: MainSectionType;
    search: string | undefined;
    sort: 'sales' | 'created';
    skip: number;
    take: number;
  }) {
    const { sectionType, search, sort, skip, take } = params;

    return this.prisma.service.findMany({
      where: this.#buildServiceCandidatesWhere(sectionType, search),
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

  countServiceCandidates(params: {
    sectionType: MainSectionType;
    search: string | undefined;
  }): Promise<number> {
    return this.prisma.service.count({
      where: this.#buildServiceCandidatesWhere(
        params.sectionType,
        params.search,
      ),
    });
  }

  #buildServiceCandidatesWhere(
    sectionType: MainSectionType,
    search: string | undefined,
  ): Prisma.ServiceWhereInput {
    return {
      serviceGroup: { name: SECTION_TO_GROUP[sectionType] },
      ...(search && { title: { contains: search, mode: 'insensitive' } }),
    };
  }

  findExpertCandidates(params: {
    sectionType: MainSectionType;
    search: string | undefined;
    sort: 'sales' | 'created';
    skip: number;
    take: number;
  }) {
    const { sectionType, search, sort, skip, take } = params;

    return this.prisma.user.findMany({
      where: this.#buildExpertCandidatesWhere(sectionType, search),
      skip,
      take,
      orderBy:
        sort === 'sales'
          ? { ordersAsExpert: { _count: 'desc' } }
          : { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        provider: true,
        region: true,
        createdAt: true,
        expertProfile: {
          select: {
            businessName: true,
            isApproved: true,
            specialtyCategories: {
              select: {
                serviceGroup: { select: { name: true } },
              },
            },
          },
        },
        _count: {
          select: {
            ordersAsExpert: true,
            receivedReports: true,
          },
        },
      },
    });
  }

  countExpertCandidates(params: {
    sectionType: MainSectionType;
    search: string | undefined;
  }): Promise<number> {
    return this.prisma.user.count({
      where: this.#buildExpertCandidatesWhere(
        params.sectionType,
        params.search,
      ),
    });
  }

  #buildExpertCandidatesWhere(
    sectionType: MainSectionType,
    search: string | undefined,
  ): Prisma.UserWhereInput {
    return {
      role: 'EXPERT',
      expertProfile: {
        isApproved: true,
        specialtyCategories: {
          some: { serviceGroup: { name: SECTION_TO_GROUP[sectionType] } },
        },
      },
      ...(search && {
        expertProfile: {
          isApproved: true,
          businessName: { contains: search, mode: 'insensitive' },
          specialtyCategories: {
            some: { serviceGroup: { name: SECTION_TO_GROUP[sectionType] } },
          },
        },
      }),
    };
  }

  // 한도 검증용 — 해당 sectionType에 현재 등록된 row 수
  countBySectionType(sectionType: MainSectionType): Promise<number> {
    return this.prisma.mainSetting.count({
      where: { sectionType },
    });
  }

  // 후보 응답의 registered 필드용 — 해당 sectionType에 등록된 서비스들 (id + title)
  findRegisteredServicesBySection(sectionType: MainSectionType) {
    return this.prisma.mainSetting
      .findMany({
        where: { sectionType, targetServiceId: { not: null } },
        select: {
          targetService: {
            select: { id: true, title: true },
          },
        },
      })
      .then((rows) =>
        rows
          .map((r) => r.targetService)
          .filter((s): s is { id: string; title: string } => s !== null),
      );
  }

  // 후보 응답의 registered 필드용 — 해당 sectionType에 등록된 전문가들 (id + businessName)
  findRegisteredExpertsBySection(sectionType: MainSectionType) {
    return this.prisma.mainSetting
      .findMany({
        where: { sectionType, targetUserId: { not: null } },
        select: {
          targetUser: {
            select: {
              id: true,
              expertProfile: {
                select: { businessName: true },
              },
            },
          },
        },
      })
      .then((rows) =>
        rows
          .map((r) => r.targetUser)
          .filter((u): u is NonNullable<typeof u> => u !== null)
          .map((u) => ({
            id: u.id,
            businessName: u.expertProfile?.businessName ?? null,
          })),
      );
  }

  // 중복 등록 방지용 — targetIds 중 이미 등록된 ID들 반환
  findExistingTargetIdsInSection(
    sectionType: MainSectionType,
    targetIds: string[],
  ): Promise<string[]> {
    return this.prisma.mainSetting
      .findMany({
        where: {
          sectionType,
          OR: [
            { targetServiceId: { in: targetIds } },
            { targetUserId: { in: targetIds } },
          ],
        },
        select: { targetServiceId: true, targetUserId: true },
      })
      .then((rows) =>
        rows
          .map((r) => r.targetServiceId ?? r.targetUserId)
          .filter((id): id is string => id !== null),
      );
  }

  // group 일치 검증용 (서비스) — id별 group 매핑
  findServicesByIds(ids: string[]) {
    return this.prisma.service.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        serviceGroup: { select: { name: true } },
      },
    });
  }

  // group 일치 검증용 (전문가) — id별 specialty 매핑 + role 확인
  findExpertsByIds(ids: string[]) {
    return this.prisma.user.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        role: true,
        expertProfile: {
          select: {
            isApproved: true,
            specialtyCategories: {
              select: {
                serviceGroup: { select: { name: true } },
              },
            },
          },
        },
      },
    });
  }

  // 삭제 검증용 — mainSettingIds로 row 정보 가져옴 (SECTION_MISMATCH 체크 + 존재 여부)
  findMainSettingsByIds(ids: string[]) {
    return this.prisma.mainSetting.findMany({
      where: { id: { in: ids } },
      select: { id: true, sectionType: true },
    });
  }

  // 등록 트랜잭션 — MainSetting.createMany + 활동로그 createMany
  createMainSettings(params: {
    sectionType: MainSectionType;
    targetType: MainTargetType;
    targetIds: string[];
    adminId: string;
  }): Promise<{ id: string }[]> {
    const { sectionType, targetType, targetIds, adminId } = params;

    const rows = targetIds.map((targetId) => ({
      sectionType,
      targetType,
      targetServiceId: targetType === MainTargetType.SERVICE ? targetId : null,
      targetUserId: targetType === MainTargetType.USER ? targetId : null,
    }));

    return this.prisma.$transaction(async (tx) => {
      const created = await Promise.all(
        rows.map((data) =>
          tx.mainSetting.create({
            data,
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

  // 삭제 트랜잭션 — 활동로그 createMany + MainSetting.deleteMany
  deleteMainSettings(params: {
    mainSettingIds: string[];
    adminId: string;
  }): Promise<void> {
    const { mainSettingIds, adminId } = params;

    return this.prisma.$transaction(async (tx) => {
      // 1. 활동로그 먼저 — referenceId에 아직 살아있는 MainSetting id 사용
      await tx.adminActivityLog.createMany({
        data: mainSettingIds.map((id) => ({
          adminId,
          actionType: AdminActionType.MAIN_UPDATED,
          referenceId: id,
        })),
      });

      // 2. 삭제
      await tx.mainSetting.deleteMany({
        where: { id: { in: mainSettingIds } },
      });
    });
  }

  // 한도 검증용 (최대 1개)
  countBanners(): Promise<number> {
    return this.prisma.banner.count();
  }

  // 삭제 시 S3 cleanup + 존재 검증용
  findBannersByIds(ids: string[]) {
    return this.prisma.banner.findMany({
      where: { id: { in: ids } },
      select: { id: true, imageUrl: true },
    });
  }

  // 등록 트랜잭션 — Banner.create + 활동로그
  createBanner(params: {
    imageUrl: string;
    actionUrl: string;
    adminId: string;
  }): Promise<{ id: string }> {
    const { imageUrl, actionUrl, adminId } = params;

    return this.prisma.$transaction(async (tx) => {
      const banner = await tx.banner.create({
        data: { imageUrl, actionUrl },
        select: { id: true },
      });

      await tx.adminActivityLog.create({
        data: {
          adminId,
          actionType: AdminActionType.MAIN_UPDATED,
          referenceId: banner.id,
        },
      });

      return banner;
    });
  }

  // 삭제 트랜잭션 — 활동로그 createMany + Banner.deleteMany
  deleteBanners(params: {
    bannerIds: string[];
    adminId: string;
  }): Promise<void> {
    const { bannerIds, adminId } = params;

    return this.prisma.$transaction(async (tx) => {
      await tx.adminActivityLog.createMany({
        data: bannerIds.map((id) => ({
          adminId,
          actionType: AdminActionType.MAIN_UPDATED,
          referenceId: id,
        })),
      });

      await tx.banner.deleteMany({
        where: { id: { in: bannerIds } },
      });
    });
  }
}
