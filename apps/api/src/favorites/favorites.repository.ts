import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import {
  favoriteExpertUserSelect,
  favoriteServiceInclude,
} from './favorites.types';

import type {
  ExpertReviewStats,
  FavoriteExpertUser,
  FavoriteServiceWithService,
} from './favorites.types';

@Injectable()
export class FavoritesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async isFavoriteService(
    clientUserId: string,
    serviceId: string,
  ): Promise<boolean> {
    const row = await this.prisma.favoriteService.findUnique({
      where: {
        clientUserId_serviceId: { clientUserId, serviceId },
      },
      select: { id: true },
    });
    return row !== null;
  }

  async addFavoriteService(
    clientUserId: string,
    serviceId: string,
  ): Promise<void> {
    await this.prisma.favoriteService.create({
      data: { clientUserId, serviceId },
    });
  }

  async removeFavoriteService(
    clientUserId: string,
    serviceId: string,
  ): Promise<boolean> {
    const result = await this.prisma.favoriteService.deleteMany({
      where: { clientUserId, serviceId },
    });
    return result.count > 0;
  }

  async isFavoriteExpert(
    clientUserId: string,
    expertUserId: string,
  ): Promise<boolean> {
    const row = await this.prisma.favoriteExpert.findUnique({
      where: {
        clientUserId_expertUserId: { clientUserId, expertUserId },
      },
      select: { id: true },
    });
    return row !== null;
  }

  async addFavoriteExpert(
    clientUserId: string,
    expertUserId: string,
  ): Promise<void> {
    await this.prisma.favoriteExpert.create({
      data: { clientUserId, expertUserId },
    });
  }

  async removeFavoriteExpert(
    clientUserId: string,
    expertUserId: string,
  ): Promise<boolean> {
    const result = await this.prisma.favoriteExpert.deleteMany({
      where: { clientUserId, expertUserId },
    });
    return result.count > 0;
  }

  findFavoriteServices(args: {
    clientUserId: string;
    skip: number;
    take: number;
  }): Promise<FavoriteServiceWithService[]> {
    return this.prisma.favoriteService.findMany({
      where: { clientUserId: args.clientUserId },
      orderBy: { createdAt: 'desc' },
      skip: args.skip,
      take: args.take,
      include: favoriteServiceInclude,
    });
  }

  countFavoriteServices(clientUserId: string): Promise<number> {
    return this.prisma.favoriteService.count({
      where: { clientUserId },
    });
  }

  findFavoriteExperts(args: {
    clientUserId: string;
    skip: number;
    take: number;
  }): Promise<{ expertUser: FavoriteExpertUser }[]> {
    return this.prisma.favoriteExpert.findMany({
      where: { clientUserId: args.clientUserId },
      orderBy: { createdAt: 'desc' },
      skip: args.skip,
      take: args.take,
      select: {
        expertUser: {
          select: favoriteExpertUserSelect,
        },
      },
    });
  }

  countFavoriteExperts(clientUserId: string): Promise<number> {
    return this.prisma.favoriteExpert.count({
      where: { clientUserId },
    });
  }

  async getReviewStatsByExpertUserIds(
    expertUserIds: string[],
  ): Promise<Map<string, ExpertReviewStats>> {
    if (expertUserIds.length === 0) {
      return new Map();
    }

    const reviews = await this.prisma.review.findMany({
      where: { order: { expertUserId: { in: expertUserIds } } },
      select: {
        rating: true,
        order: { select: { expertUserId: true } },
      },
    });

    const acc = new Map<string, { sum: number; count: number }>();
    for (const review of reviews) {
      const expertUserId = review.order.expertUserId;
      const cur = acc.get(expertUserId) ?? { sum: 0, count: 0 };
      acc.set(expertUserId, {
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
