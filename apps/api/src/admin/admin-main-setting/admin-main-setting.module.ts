import { Module } from '@nestjs/common';

import { AdminMainSettingController } from './admin-main-setting.controller';
import { AdminMainSettingRepository } from './admin-main-setting.repository';
import { AdminMainSettingService } from './admin-main-setting.service';

@Module({
  controllers: [AdminMainSettingController],
  providers: [AdminMainSettingService, AdminMainSettingRepository],
})
export class AdminMainSettingModule {}
