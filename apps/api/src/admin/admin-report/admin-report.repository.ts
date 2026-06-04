import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

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
}
