import { Injectable } from '@nestjs/common';
import { Portfolio } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PortfoliosRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string): Promise<Portfolio | null> {
    return this.prisma.portfolio.findUnique({
      where: { id },
    });
  }
}
