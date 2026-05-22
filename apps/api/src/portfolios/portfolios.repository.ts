import { Injectable } from '@nestjs/common';
import { BusinessSector, StackType } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { portfolioInclude } from './portfolios.types';

import type { PortfolioWithRelations } from './portfolios.types';

@Injectable()
export class PortfoliosRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string): Promise<PortfolioWithRelations | null> {
    return this.prisma.portfolio.findUnique({
      where: { id },
      include: portfolioInclude,
    });
  }

  create(data: {
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
}
