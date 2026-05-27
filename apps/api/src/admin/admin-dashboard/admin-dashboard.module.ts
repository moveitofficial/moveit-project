import { Module } from '@nestjs/common';

import { AdminDashboardController } from './admin-dashboard.controller';
import { AdminDashboardRepository } from './admin-dashboard.repository';
import { AdminDashboardService } from './admin-dashboard.service';

@Module({
  controllers: [AdminDashboardController],
  providers: [AdminDashboardService, AdminDashboardRepository],
})
export class AdminDashboardModule {}
