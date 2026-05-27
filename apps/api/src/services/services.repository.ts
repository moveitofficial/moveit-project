import { Injectable } from '@nestjs/common';

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
import type { Prisma } from '@prisma/client';

@Injectable()
export class ServicesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    data: Prisma.ServiceUncheckedCreateInput,
  ): Promise<ServiceWithRelations> {
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

  async isFavorite(clientUserId: string, serviceId: string): Promise<boolean> {
    const row = await this.prisma.favoriteService.findUnique({
      where: {
        clientUserId_serviceId: { clientUserId, serviceId },
      },
      select: { id: true },
    });
    return row !== null;
  }

  update(
    id: string,
    data: Prisma.ServiceUncheckedUpdateInput,
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
}
