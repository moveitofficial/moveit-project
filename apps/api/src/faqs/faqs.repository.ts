import { Injectable } from '@nestjs/common';
import { Faq, Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FaqsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany(args: {
    skip: number;
    take: number;
    search?: string;
  }): Promise<Faq[]> {
    return this.prisma.faq.findMany({
      where: this.buildWhere(args.search),
      orderBy: { createdAt: 'desc' },
      skip: args.skip,
      take: args.take,
    });
  }

  count(search?: string): Promise<number> {
    return this.prisma.faq.count({
      where: this.buildWhere(search),
    });
  }

  findById(id: string): Promise<Faq | null> {
    return this.prisma.faq.findUnique({
      where: { id },
    });
  }

  private buildWhere(search?: string): Prisma.FaqWhereInput {
    if (search === undefined || search.trim() === '') {
      return {};
    }
    return {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ],
    };
  }
}
