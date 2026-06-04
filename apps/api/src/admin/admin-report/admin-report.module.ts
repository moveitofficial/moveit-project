import { Module } from '@nestjs/common';

import { AdminReportController } from './admin-report.controller';
import { AdminReportRepository } from './admin-report.repository';
import { AdminReportService } from './admin-report.service';

@Module({
  controllers: [AdminReportController],
  providers: [AdminReportService, AdminReportRepository],
})
export class AdminReportModule {}
