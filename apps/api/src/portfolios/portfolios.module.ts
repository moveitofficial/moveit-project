import { Module } from '@nestjs/common';

import { ExpertProfilesModule } from '../expert-profiles/expert-profiles.module';
import { UploadModule } from '../upload/upload.module';

import { PortfoliosController } from './portfolios.controller';
import { PortfoliosRepository } from './portfolios.repository';
import { PortfoliosService } from './portfolios.service';

@Module({
  imports: [ExpertProfilesModule, UploadModule],
  controllers: [PortfoliosController],
  providers: [PortfoliosService, PortfoliosRepository],
  exports: [PortfoliosService],
})
export class PortfoliosModule {}
