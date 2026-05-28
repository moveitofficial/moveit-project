import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { UploadModule } from '../upload/upload.module';

import { ServicesController } from './services.controller';
import { ServicesRepository } from './services.repository';
import { ServicesService } from './services.service';

@Module({
  imports: [AuthModule, UploadModule],
  controllers: [ServicesController],
  providers: [ServicesService, ServicesRepository],
  exports: [ServicesService],
})
export class ServicesModule {}
