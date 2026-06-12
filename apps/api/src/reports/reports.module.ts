import { Module } from '@nestjs/common';

import { UploadModule } from '../upload/upload.module';
import { UsersModule } from '../users/users.module';

import { ReportsController } from './reports.controller';
import { ReportsRepository } from './reports.repository';
import { ReportsService } from './reports.service';

@Module({
  imports: [UsersModule, UploadModule],
  controllers: [ReportsController],
  providers: [ReportsService, ReportsRepository],
})
export class ReportsModule {}
