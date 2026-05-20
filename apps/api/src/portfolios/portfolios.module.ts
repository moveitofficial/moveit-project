import { Module } from '@nestjs/common';

import { PortfoliosController } from './portfolios.controller';
import { PortfoliosRepository } from './portfolios.repository';
import { PortfoliosService } from './portfolios.service';

@Module({
  controllers: [PortfoliosController],
  providers: [PortfoliosService, PortfoliosRepository],
})
export class PortfoliosModule {}
