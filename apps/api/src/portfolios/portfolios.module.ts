import { Module } from '@nestjs/common';

import { ExpertProfilesModule } from '../expert-profiles/expert-profiles.module';

import { PortfoliosController } from './portfolios.controller';
import { PortfoliosRepository } from './portfolios.repository';
import { PortfoliosService } from './portfolios.service';

@Module({
  imports: [ExpertProfilesModule],
  controllers: [PortfoliosController],
  providers: [PortfoliosService, PortfoliosRepository],
  exports: [PortfoliosService],
})
export class PortfoliosModule {}
