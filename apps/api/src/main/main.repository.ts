import { Injectable } from '@nestjs/common';
import { MainSectionType, Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { serviceListInclude } from '../services/services.types';

const SERVICE_SECTIONS: MainSectionType[] = [
  MainSectionType.POPULAR_IT_COACHING,
  MainSectionType.POPULAR_PROJECT_REQUEST,
  MainSectionType.RECOMMENDED_IT_COACHING,
  MainSectionType.RECOMMENDED_PROJECT_REQUEST,
];

const EXPERT_SECTIONS: MainSectionType[] = [
  MainSectionType.MOVEIT_POPULAR_COACHING,
  MainSectionType.MOVEIT_POPULAR_PROJECT_EXPERT,
];

const expertMainSelect = {
  id: true,
  name: true,
  profileImageUrl: true,
  region: true,
  expertProfile: {
    select: {
      businessName: true,
      avgRating: true,
      reviewCount: true,
      techStacks: {
        select: { techStack: { select: { name: true } } },
      },
      specialtyCategories: {
        select: { serviceGroup: { select: { name: true } } },
      },
    },
  },
} satisfies Prisma.UserSelect;

@Injectable()
export class MainRepository {
  constructor(private readonly prisma: PrismaService) {}

  findServiceSettings() {
    return this.prisma.mainSetting.findMany({
      where: {
        sectionType: { in: SERVICE_SECTIONS },
        targetServiceId: { not: null },
      },
      select: {
        sectionType: true,
        targetService: { include: serviceListInclude },
      },
    });
  }

  findExpertSettings() {
    return this.prisma.mainSetting.findMany({
      where: {
        sectionType: { in: EXPERT_SECTIONS },
        targetUserId: { not: null },
      },
      select: {
        sectionType: true,
        targetUser: { select: expertMainSelect },
      },
    });
  }

  findLatestBanner() {
    return this.prisma.banner.findFirst({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        imageUrl: true,
        actionUrl: true,
      },
    });
  }

  async getReviewStatsByServiceIds(
    serviceIds: string[],
  ): Promise<Map<string, { reviewCount: number; rating: number }>> {
    if (serviceIds.length === 0) {
      return new Map();
    }

    const reviews = await this.prisma.review.findMany({
      where: { order: { serviceId: { in: serviceIds } } },
      select: {
        rating: true,
        order: { select: { serviceId: true } },
      },
    });

    const acc = new Map<string, { sum: number; count: number }>();
    for (const review of reviews) {
      const serviceId = review.order.serviceId;
      const cur = acc.get(serviceId) ?? { sum: 0, count: 0 };
      acc.set(serviceId, {
        sum: cur.sum + review.rating,
        count: cur.count + 1,
      });
    }

    const result = new Map<string, { reviewCount: number; rating: number }>();
    for (const serviceId of serviceIds) {
      const bucket = acc.get(serviceId);
      const count = bucket?.count ?? 0;
      result.set(serviceId, {
        reviewCount: count,
        rating:
          count > 0 ? Math.round(((bucket?.sum ?? 0) / count) * 10) / 10 : 0,
      });
    }
    return result;
  }
}
