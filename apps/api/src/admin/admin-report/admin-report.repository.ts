import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

import type { GetReportsQueryDto } from './dto/list/reports-query.dto';

@Injectable()
export class AdminReportRepository {
  constructor(private readonly prisma: PrismaService) {}

  findReportDetailById(reportId: string) {
    return this.prisma.report.findUnique({
      where: { id: reportId },
      select: {
        id: true,
        reason: true,
        detail: true,
        reporter: { select: { id: true, name: true } },
        reported: { select: { id: true, name: true } },
        images: {
          select: { imageUrl: true },
        },
      },
    });
  }

  countReports(query: GetReportsQueryDto): Promise<number> {
    return this.prisma.report.count({ where: this.#buildReportsWhere(query) });
  }

  findReports(query: GetReportsQueryDto, skip: number, take: number) {
    return this.prisma.report.findMany({
      where: this.#buildReportsWhere(query),
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        reason: true,
        detail: true,
        createdAt: true,
        reporter: {
          select: {
            id: true,
            name: true,
            expertProfile: { select: { businessName: true } },
          },
        },
        reported: {
          select: {
            id: true,
            name: true,
            expertProfile: { select: { businessName: true } },
          },
        },
      },
    });
  }

  #buildReportsWhere(query: GetReportsQueryDto): Prisma.ReportWhereInput {
    const { reason, search } = query;

    return {
      ...(reason && { reason }),
      ...(search && {
        OR: [
          { reporter: { name: { contains: search, mode: 'insensitive' } } },
          {
            reporter: {
              expertProfile: {
                businessName: { contains: search, mode: 'insensitive' },
              },
            },
          },
          { reported: { name: { contains: search, mode: 'insensitive' } } },
          {
            reported: {
              expertProfile: {
                businessName: { contains: search, mode: 'insensitive' },
              },
            },
          },
        ],
      }),
    };
  }
}
