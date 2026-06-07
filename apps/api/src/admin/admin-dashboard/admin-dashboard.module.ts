import { Module } from '@nestjs/common';

import { AdminActivityModule } from '../admin-activity/admin-activity.module';

import { AdminDashboardController } from './admin-dashboard.controller';
import { AdminDashboardRepository } from './admin-dashboard.repository';
import { AdminDashboardService } from './admin-dashboard.service';

@Module({
  imports: [AdminActivityModule],
  controllers: [AdminDashboardController],
  providers: [AdminDashboardService, AdminDashboardRepository],
})
export class AdminDashboardModule {}
