import { Module } from '@nestjs/common';

import { ClientProfilesController } from './client-profiles.controller';
import { ClientProfilesRepository } from './client-profiles.repository';
import { ClientProfilesService } from './client-profiles.service';

@Module({
  providers: [ClientProfilesService, ClientProfilesRepository],
  controllers: [ClientProfilesController],
  exports: [ClientProfilesService],
})
export class ClientProfilesModule {}
