import { Module } from '@nestjs/common';

import { ExpertProfilesModule } from '../expert-profiles/expert-profiles.module';
import { UploadModule } from '../upload/upload.module';

import { MePortfoliosController } from './me-portfolios.controller';
import { PortfoliosController } from './portfolios.controller';
import { PortfoliosRepository } from './portfolios.repository';
import { PortfoliosService } from './portfolios.service';

@Module({
  imports: [ExpertProfilesModule, UploadModule],
  controllers: [PortfoliosController, MePortfoliosController],
  providers: [PortfoliosService, PortfoliosRepository],
  exports: [PortfoliosService],
})
export class PortfoliosModule {}
