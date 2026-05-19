import { Module } from '@nestjs/common';

import { UsersRepository } from '../users/users.repository';

import { ClientProfilesController } from './client-profiles.controller';
import { ClientProfilesRepository } from './client-profiles.repository';
import { ClientProfilesService } from './client-profiles.service';

@Module({
  providers: [ClientProfilesService, ClientProfilesRepository, UsersRepository],
  controllers: [ClientProfilesController],
  exports: [ClientProfilesService],
})
export class ClientProfilesModule {}
