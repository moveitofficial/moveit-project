import { Module } from '@nestjs/common';

import { AdminStatisticsController } from './admin-statistics.controller';
import { AdminStatisticsRepository } from './admin-statistics.repository';
import { AdminStatisticsService } from './admin-statistics.service';

@Module({
  controllers: [AdminStatisticsController],
  providers: [AdminStatisticsService, AdminStatisticsRepository],
})
export class AdminStatisticsModule {}
