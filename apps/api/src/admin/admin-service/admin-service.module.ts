import { Module } from '@nestjs/common';

import { AdminServiceController } from './admin-service.controller';
import { AdminServiceRepository } from './admin-service.repository';
import { AdminServiceService } from './admin-service.service';

@Module({
  controllers: [AdminServiceController],
  providers: [AdminServiceService, AdminServiceRepository],
})
export class AdminServiceModule {}
