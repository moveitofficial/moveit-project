import { Module } from '@nestjs/common';

import { UploadModule } from '../upload/upload.module';

import { ServicesController } from './services.controller';
import { ServicesRepository } from './services.repository';
import { ServicesService } from './services.service';

@Module({
  imports: [UploadModule],
  controllers: [ServicesController],
  providers: [ServicesService, ServicesRepository],
  exports: [ServicesService, ServicesRepository],
})
export class ServicesModule {}
