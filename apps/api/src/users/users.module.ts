import { Module } from '@nestjs/common';

import { ClientProfilesModule } from '../client-profiles/client-profiles.module';

import { MeController } from './me.controller';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [ClientProfilesModule],
  providers: [UsersRepository, UsersService],
  controllers: [UsersController, MeController],
  exports: [UsersService],
})
export class UsersModule {}
