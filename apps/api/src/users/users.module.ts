import { Module } from '@nestjs/common';

import { ClientProfilesModule } from '../client-profiles/client-profiles.module';
import { ClientProfilesRepository } from '../client-profiles/client-profiles.repository';
import { ExpertProfilesModule } from '../expert-profiles/expert-profiles.module';
import { ExpertProfilesRepository } from '../expert-profiles/expert-profiles.repository';

import { MeController } from './me.controller';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [ClientProfilesModule, ExpertProfilesModule],
  providers: [
    UsersRepository,
    UsersService,
    ClientProfilesRepository,
    ExpertProfilesRepository,
  ],
  controllers: [UsersController, MeController],
  exports: [UsersService],
})
export class UsersModule {}
