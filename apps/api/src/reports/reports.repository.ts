import { Injectable } from '@nestjs/common';
import { Report } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { ReportsRequestDto } from './dto/reports-request.dto';

@Injectable()
export class ReportsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(reporterId: string, dto: ReportsRequestDto): Promise<Report> {
    return this.prisma.report.create({
      data: {
        reporterId,
        reportedId: dto.reportedUserId,
        reason: dto.reason,
        detail: dto.detail,
        images: {
          create: dto.imageUrls?.map((imageUrl) => ({ imageUrl })) ?? [],
        },
      },
    });
  }
}
