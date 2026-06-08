import { Injectable } from '@nestjs/common';
import { MainSectionType } from '@prisma/client';

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
}
