import { Injectable } from '@nestjs/common';

import { PortfoliosRepository } from './portfolios.repository';

@Injectable()
export class PortfoliosService {
  constructor(private readonly portfoliosRepository: PortfoliosRepository) {}

  findOneById(id: string) {
    return this.portfoliosRepository.findById(id);
  }
}
