import { Controller } from '@nestjs/common';

import { PortfoliosService } from '../portfolios/portfolios.service';

@Controller('portfolios')
export class PortfoliosController {
  constructor(private readonly portfoliosService: PortfoliosService) {}
}
