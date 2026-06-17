import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

const TOP_SELLER_LIMIT = 10;

@Injectable()
export class AdminStatisticsRepository {
  constructor(private readonly prisma: PrismaService) {}

  aggregateSummary(startDate: Date, endDate: Date) {
    return this.prisma.statisticsBySeller.aggregate({
      where: { date: { gte: startDate, lte: endDate } },
      _sum: { totalTransactionAmount: true, totalTransactionCount: true },
      _max: { maxTransactionAmount: true },
    });
  }

  groupByDate(startDate: Date, endDate: Date) {
    return this.prisma.statisticsBySeller.groupBy({
      by: ['date'],
      where: { date: { gte: startDate, lte: endDate } },
      _sum: { totalTransactionAmount: true, totalTransactionCount: true },
      orderBy: { date: 'asc' },
    });
  }

  groupByCategory(startDate: Date, endDate: Date) {
    return this.prisma.statisticsByCategory.groupBy({
      by: ['serviceGroupId', 'serviceCategoryId'],
      where: { date: { gte: startDate, lte: endDate } },
      _sum: { totalTransactionAmount: true, totalTransactionCount: true },
      orderBy: { _sum: { totalTransactionAmount: 'desc' } },
    });
  }

  groupByTopSeller(startDate: Date, endDate: Date) {
    return this.prisma.statisticsBySeller.groupBy({
      by: ['sellerUserId'],
      where: { date: { gte: startDate, lte: endDate } },
      _sum: { totalTransactionAmount: true, totalTransactionCount: true },
      orderBy: { _sum: { totalTransactionAmount: 'desc' } },
      take: TOP_SELLER_LIMIT,
    });
  }

  findServiceGroupsByIds(ids: string[]) {
    return this.prisma.serviceGroup.findMany({
      where: { id: { in: ids } },
      select: { id: true, name: true },
    });
  }

  findServiceCategoriesByIds(ids: string[]) {
    return this.prisma.serviceCategory.findMany({
      where: { id: { in: ids } },
      select: { id: true, name: true },
    });
  }

  findSellersWithProfile(sellerUserIds: string[]) {
    return this.prisma.user.findMany({
      where: { id: { in: sellerUserIds } },
      select: {
        id: true,
        email: true,
        provider: true,
        region: true,
        createdAt: true,
        expertProfile: {
          select: { businessName: true, avgRating: true },
        },
      },
    });
  }
}
