import { Module } from '@nestjs/common';

import { UsersRepository } from '../users/users.repository';

import { ClientProfilesRepository } from './client-profiles.repository';
import { ClientProfilesService } from './client-profiles.service';

@Module({
  providers: [ClientProfilesService, ClientProfilesRepository, UsersRepository],
  exports: [ClientProfilesService, ClientProfilesRepository],
})
export class ClientProfilesModule {}
