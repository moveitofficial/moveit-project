import { Module } from '@nestjs/common';

import { ClientProfilesModule } from '../client-profiles/client-profiles.module';
import { ExpertProfilesModule } from '../expert-profiles/expert-profiles.module';
import { PortfoliosModule } from '../portfolios/portfolios.module';
import { ServicesModule } from '../services/services.module';
import { UploadModule } from '../upload/upload.module';

import { MePortfoliosController } from './me-portfolios.controller';
import { MeController } from './me.controller';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [
    ClientProfilesModule,
    ExpertProfilesModule,
    PortfoliosModule,
    UploadModule,
    ServicesModule,
  ],
  providers: [UsersRepository, UsersService],
  controllers: [UsersController, MeController, MePortfoliosController],
  exports: [UsersService],
})
export class UsersModule {}
