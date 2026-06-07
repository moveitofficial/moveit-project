import { Injectable } from '@nestjs/common';

import { REPORT_ERRORS } from '../../common/constants/errors';
import { AppException } from '../../common/exceptions/app.exception';
import { Paginated } from '../../common/types/paginated.type';
import { toPaginatedResponse } from '../../common/utils/list-response.util';

import { AdminReportRepository } from './admin-report.repository';
import { GetReportsQueryDto } from './dto/list/reports-query.dto';
import { ReportItemDto } from './dto/list/reports-response.dto';
import { ReportDetailResponseDto } from './dto/report-detail-response.dto';

@Injectable()
export class AdminReportService {
  constructor(private readonly adminReportRepository: AdminReportRepository) {}

  async getReportDetail(reportId: string): Promise<ReportDetailResponseDto> {
    const report =
      await this.adminReportRepository.findReportDetailById(reportId);
    if (!report) {
      throw new AppException(REPORT_ERRORS.NOT_FOUND);
    }

    return {
      id: report.id,
      reporter: report.reporter,
      reported: report.reported,
      reason: report.reason,
      detail: report.detail,
      images: report.images.map((img) => img.imageUrl),
    };
  }

  async getReports(
    query: GetReportsQueryDto,
  ): Promise<Paginated<ReportItemDto>> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 50;
    const skip = (page - 1) * pageSize;

    const [rows, totalCount] = await Promise.all([
      this.adminReportRepository.findReports(query, skip, pageSize),
      this.adminReportRepository.countReports(query),
    ]);

    const items: ReportItemDto[] = rows.map((r) => ({
      id: r.id,
      reason: r.reason,
      detail: r.detail,
      createdAt: r.createdAt,
      reporter: {
        id: r.reporter.id,
        name: r.reporter.name,
        businessName: r.reporter.expertProfile?.businessName ?? null,
      },
      reported: {
        id: r.reported.id,
        name: r.reported.name,
        businessName: r.reported.expertProfile?.businessName ?? null,
      },
    }));

    return toPaginatedResponse(items, { page, pageSize, totalCount });
  }
}
