import { Module } from '@nestjs/common';

import { UsersRepository } from '../users/users.repository';

import { ExpertProfilesRepository } from './expert-profiles.repository';
import { ExpertProfilesService } from './expert-profiles.service';

@Module({
  providers: [ExpertProfilesService, ExpertProfilesRepository, UsersRepository],
  exports: [ExpertProfilesService, ExpertProfilesRepository],
})
export class ExpertProfilesModule {}
