import { Module } from '@nestjs/common';

import { UploadModule } from '../../upload/upload.module';

import { AdminMainSettingController } from './admin-main-setting.controller';
import { AdminMainSettingRepository } from './admin-main-setting.repository';
import { AdminMainSettingService } from './admin-main-setting.service';

@Module({
  imports: [UploadModule],
  controllers: [AdminMainSettingController],
  providers: [AdminMainSettingService, AdminMainSettingRepository],
})
export class AdminMainSettingModule {}
