import { Injectable } from '@nestjs/common';

import { REPORT_ERRORS } from '../../common/constants/errors';
import { AppException } from '../../common/exceptions/app.exception';

import { AdminReportRepository } from './admin-report.repository';
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
}
