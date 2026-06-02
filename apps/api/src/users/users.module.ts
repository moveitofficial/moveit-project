import { Module } from '@nestjs/common';

import { ClientProfilesModule } from '../client-profiles/client-profiles.module';
import { ExpertProfilesModule } from '../expert-profiles/expert-profiles.module';
import { OrdersModule } from '../orders/orders.module';
import { MePortfoliosController } from '../portfolios/me-portfolios.controller';
import { PortfoliosModule } from '../portfolios/portfolios.module';
import { ServicesModule } from '../services/services.module';
import { UploadModule } from '../upload/upload.module';

import { MeController } from './me.controller';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [
    ClientProfilesModule,
    ExpertProfilesModule,
    OrdersModule,
    PortfoliosModule,
    UploadModule,
    ServicesModule,
  ],
  providers: [UsersRepository, UsersService],
  controllers: [MeController, MePortfoliosController, UsersController],
  exports: [UsersService],
})
export class UsersModule {}
