import { Injectable } from '@nestjs/common';

import { STATISTICS_ERRORS } from '../../common/constants/errors';
import { AppException } from '../../common/exceptions/app.exception';

import { AdminStatisticsRepository } from './admin-statistics.repository';

import type { StatisticsQueryDto } from './dto/statistics-query.dto';
import type {
  CategorySalesItemDto,
  StatisticsResponseDto,
  TopSellerItemDto,
} from './dto/statistics-response.dto';

@Injectable()
export class AdminStatisticsService {
  constructor(
    private readonly adminStatisticsRepository: AdminStatisticsRepository,
  ) {}

  async getSalesStatistics(
    query: StatisticsQueryDto,
  ): Promise<StatisticsResponseDto> {
    const start = new Date(query.startDate);
    const end = new Date(query.endDate);

    if (start > end) {
      throw new AppException(STATISTICS_ERRORS.INVALID_DATE_RANGE);
    }

    const [summaryResult, dailyResult, categoryResult, topSellerResult] =
      await Promise.all([
        this.adminStatisticsRepository.aggregateSummary(start, end),
        this.adminStatisticsRepository.groupByDate(start, end),
        this.adminStatisticsRepository.groupByCategory(start, end),
        this.adminStatisticsRepository.groupByTopSeller(start, end),
      ]);

    const totalAmount = summaryResult._sum.totalTransactionAmount ?? 0;
    const totalCount = summaryResult._sum.totalTransactionCount ?? 0;

    const summary = {
      totalTransactionAmount: totalAmount,
      totalTransactionCount: totalCount,
      averageTransactionAmount:
        totalCount > 0 ? Math.round(totalAmount / totalCount) : 0,
      maxTransactionAmount: summaryResult._max.maxTransactionAmount ?? 0,
    };

    const dailySales = dailyResult.map((d) => ({
      date: d.date.toISOString().slice(0, 10),
      totalTransactionAmount: d._sum.totalTransactionAmount ?? 0,
      totalTransactionCount: d._sum.totalTransactionCount ?? 0,
    }));

    let categorySales: CategorySalesItemDto[] = [];
    if (categoryResult.length > 0) {
      const groupIds = [
        ...new Set(categoryResult.map((c) => c.serviceGroupId)),
      ];
      const categoryIds = [
        ...new Set(categoryResult.map((c) => c.serviceCategoryId)),
      ];

      const [groups, categories] = await Promise.all([
        this.adminStatisticsRepository.findServiceGroupsByIds(groupIds),
        this.adminStatisticsRepository.findServiceCategoriesByIds(categoryIds),
      ]);

      const groupMap = new Map(groups.map((g) => [g.id, g.name]));
      const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

      categorySales = categoryResult.flatMap((c) => {
        const serviceGroupName = groupMap.get(c.serviceGroupId);
        const serviceCategoryName = categoryMap.get(c.serviceCategoryId);
        if (!serviceGroupName || !serviceCategoryName) return [];
        return [
          {
            serviceGroupName,
            serviceCategoryName,
            totalTransactionAmount: c._sum.totalTransactionAmount ?? 0,
            totalTransactionCount: c._sum.totalTransactionCount ?? 0,
          },
        ];
      });
    }

    let topSellers: TopSellerItemDto[] = [];
    if (topSellerResult.length > 0) {
      const sellerIds = topSellerResult.map((s) => s.sellerUserId);
      const users =
        await this.adminStatisticsRepository.findSellersWithProfile(sellerIds);
      const userMap = new Map(users.map((u) => [u.id, u]));

      topSellers = topSellerResult.flatMap((s) => {
        const user = userMap.get(s.sellerUserId);
        if (!user) {
          return [];
        }
        return [
          {
            sellerUserId: s.sellerUserId,
            businessName: user.expertProfile?.businessName ?? null,
            email: user.email,
            provider: user.provider,
            totalTransactionAmount: s._sum.totalTransactionAmount ?? 0,
            totalTransactionCount: s._sum.totalTransactionCount ?? 0,
            region: user.region,
            avgRating: user.expertProfile?.avgRating ?? null,
            createdAt: user.createdAt.toISOString(),
          },
        ];
      });
    }

    return { summary, dailySales, categorySales, topSellers };
  }
}
