import { Module } from '@nestjs/common';

import { UploadModule } from '../upload/upload.module';

import { MeServicesController } from './me-services.controller';
import { ServicesController } from './services.controller';
import { ServicesRepository } from './services.repository';
import { ServicesService } from './services.service';

@Module({
  imports: [UploadModule],
  controllers: [ServicesController, MeServicesController],
  providers: [ServicesService, ServicesRepository],
  exports: [ServicesService],
})
export class ServicesModule {}
