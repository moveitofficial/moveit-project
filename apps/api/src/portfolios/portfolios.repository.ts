import { Injectable } from '@nestjs/common';
import { BusinessSector, StackType } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { portfolioInclude, PortfolioListInclude } from './portfolios.types';

import type {
  PortfolioListItem,
  PortfolioWithRelations,
} from './portfolios.types';

@Injectable()
export class PortfoliosRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string): Promise<PortfolioWithRelations | null> {
    return this.prisma.portfolio.findUnique({
      where: { id },
      include: portfolioInclude,
    });
  }

  findManyByExpertProfileId(
    expertProfileId: string,
  ): Promise<PortfolioListItem[]> {
    return this.prisma.portfolio.findMany({
      where: { expertProfileId },
      include: PortfolioListInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  findByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<PortfolioWithRelations | null> {
    return this.prisma.portfolio.findFirst({
      where: { id, expertProfile: { userId } },
      include: portfolioInclude,
    });
  }

  create(data: {
    id: string;
    expertProfileId: string;
    title: string;
    description: string;
    clientName: string;
    businessSector: BusinessSector;
    images: { imgUrl: string; isMain: boolean }[];
    skills: { stackName: string; stackType: StackType }[];
  }): Promise<PortfolioWithRelations> {
    return this.prisma.portfolio.create({
      data: {
        id: data.id,
        expertProfileId: data.expertProfileId,
        title: data.title,
        description: data.description,
        clientName: data.clientName,
        businessSector: data.businessSector,
        images: {
          create: data.images,
        },
        skills: {
          create: data.skills,
        },
      },
      include: portfolioInclude,
    });
  }

  update(data: {
    id: string;
    title?: string;
    description?: string;
    clientName?: string;
    businessSector?: BusinessSector;
    images?: { imgUrl: string; isMain: boolean }[];
    skills?: { stackName: string; stackType: StackType }[];
  }): Promise<PortfolioWithRelations> {
    return this.prisma.portfolio.update({
      where: { id: data.id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.clientName !== undefined && { clientName: data.clientName }),
        ...(data.businessSector !== undefined && {
          businessSector: data.businessSector,
        }),
        ...(data.images !== undefined && {
          images: { deleteMany: {}, create: data.images },
        }),
        ...(data.skills !== undefined && {
          skills: { deleteMany: {}, create: data.skills },
        }),
      },
      include: portfolioInclude,
    });
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.portfolio.delete({ where: { id } });
  }
}
