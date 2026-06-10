import { Injectable } from '@nestjs/common';
import { Region, ServiceStatus, type Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import {
  reviewWithUserSelect,
  serviceDetailInclude,
  serviceInclude,
  serviceListInclude,
} from './services.types';

import type {
  ReviewWithUser,
  ServiceDetail,
  ServiceListItem,
  ServiceReviewSort,
  ServiceReviewStats,
  ServiceWithRelations,
} from './services.types';

@Injectable()
export class ServicesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.ServiceCreateInput): Promise<ServiceWithRelations> {
    return this.prisma.service.create({ data, include: serviceInclude });
  }

  findById(id: string): Promise<ServiceWithRelations | null> {
    return this.prisma.service.findUnique({
      where: { id },
      include: serviceInclude,
    });
  }

  findDetailById(id: string): Promise<ServiceDetail | null> {
    return this.prisma.service.findUnique({
      where: { id },
      include: serviceDetailInclude,
    });
  }

  async isFavorite(clientUserId: string, serviceId: string): Promise<boolean> {
    const row = await this.prisma.favoriteService.findUnique({
      where: {
        clientUserId_serviceId: { clientUserId, serviceId },
      },
      select: { id: true },
    });
    return row !== null;
  }

  findReviews(args: {
    serviceId: string;
    skip: number;
    take: number;
    sort: ServiceReviewSort;
  }): Promise<ReviewWithUser[]> {
    const orderBy =
      args.sort === 'rating'
        ? { rating: 'desc' as const }
        : { createdAt: 'desc' as const };

    return this.prisma.review.findMany({
      where: { order: { serviceId: args.serviceId } },
      select: reviewWithUserSelect,
      orderBy,
      skip: args.skip,
      take: args.take,
    });
  }

  countReviews(serviceId: string): Promise<number> {
    return this.prisma.review.count({
      where: { order: { serviceId } },
    });
  }

  update(
    id: string,
    data: Prisma.ServiceUpdateInput,
  ): Promise<ServiceWithRelations> {
    return this.prisma.service.update({
      where: { id },
      data,
      include: serviceInclude,
    });
  }

  findMany(args: {
    where: Prisma.ServiceWhereInput;
    orderBy:
      | Prisma.ServiceOrderByWithRelationInput
      | Prisma.ServiceOrderByWithRelationInput[];
    skip: number;
    take: number;
  }): Promise<ServiceListItem[]> {
    return this.prisma.service.findMany({
      where: args.where,
      orderBy: args.orderBy,
      skip: args.skip,
      take: args.take,
      include: serviceListInclude,
    });
  }

  findManyByIds(ids: string[]): Promise<ServiceListItem[]> {
    if (ids.length === 0) {
      return Promise.resolve([]);
    }
    return this.prisma.service.findMany({
      where: { id: { in: ids } },
      include: serviceListInclude,
    });
  }

  count(where: Prisma.ServiceWhereInput): Promise<number> {
    return this.prisma.service.count({ where });
  }

  findIds(where: Prisma.ServiceWhereInput): Promise<{ id: string }[]> {
    return this.prisma.service.findMany({
      where,
      select: { id: true },
    });
  }

  async getReviewStatsByServiceIds(
    serviceIds: string[],
  ): Promise<Map<string, ServiceReviewStats>> {
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

    return new Map(
      [...acc.entries()].map(([id, { sum, count }]) => [
        id,
        {
          reviewCount: count,
          rating: count > 0 ? Math.round((sum / count) * 10) / 10 : 0,
        },
      ]),
    );
  }

  findManyByExpertUserId(args: {
    expertUserId: string;
    currentServiceId: string;
    take: number;
  }): Promise<ServiceListItem[]> {
    return this.prisma.service.findMany({
      where: {
        expertUserId: args.expertUserId,
        status: ServiceStatus.ACTIVE,
        id: { not: args.currentServiceId },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: args.take,
      include: serviceListInclude,
    });
  }

  findExpertProfileByUserId(userId: string) {
    return this.prisma.expertProfile.findUnique({
      where: { userId },
    });
  }

  findRecentServicesPool(take: number) {
    return this.prisma.service.findMany({
      where: { status: ServiceStatus.ACTIVE },
      orderBy: { createdAt: 'desc' },
      take,
      include: serviceListInclude,
    });
  }

  findClientInterestPairs(userId: string) {
    return this.prisma.clientInterestCategory.findMany({
      where: { clientProfile: { userId } },
      select: { serviceGroupId: true, serviceCategoryId: true },
    });
  }

  findServicesByCategoryPairs(
    pairs: { serviceGroupId: string; serviceCategoryId: string }[],
    take: number,
  ) {
    if (pairs.length === 0) return Promise.resolve([]);
    return this.prisma.service.findMany({
      where: {
        status: ServiceStatus.ACTIVE,
        OR: pairs.map((p) => ({
          serviceGroupId: p.serviceGroupId,
          serviceCategoryId: p.serviceCategoryId,
        })),
      },
      orderBy: { createdAt: 'desc' },
      take,
      include: serviceListInclude,
    });
  }

  findUserRegion(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { region: true },
    });
  }

  findServicesByExpertRegion(region: Region, take: number) {
    return this.prisma.service.findMany({
      where: {
        status: ServiceStatus.ACTIVE,
        expertUser: { region },
      },
      orderBy: { createdAt: 'desc' },
      take,
      include: serviceListInclude,
    });
  }

  findRecentlyViewedByUser(userId: string, take: number) {
    return this.prisma.recentlyViewedService.findMany({
      where: { clientUserId: userId },
      orderBy: { viewedAt: 'desc' },
      take,
      select: {
        service: { include: serviceListInclude },
      },
    });
  }

  findSimilarActiveServices(
    serviceCategoryId: string,
    excludeIds: string[],
    take: number,
  ) {
    return this.prisma.service.findMany({
      where: {
        status: ServiceStatus.ACTIVE,
        serviceCategoryId,
        id: { notIn: excludeIds },
      },
      orderBy: { createdAt: 'desc' },
      take,
      include: serviceListInclude,
    });
  }
}
