import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { ReportsRequestDto } from './dto/reports-request.dto';

@Injectable()
export class ReportsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(reporterId: string, dto: ReportsRequestDto) {
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
      include: { images: true },
    });
  }
}
