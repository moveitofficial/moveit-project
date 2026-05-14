import { Injectable } from '@nestjs/common';

import { CatalogsRepository } from './catalogs.repository';

@Injectable()
export class CatalogsService {
  constructor(private readonly catalogsRepository: CatalogsRepository) {}

  findAllServiceGroups() {
    return this.catalogsRepository.findAllServiceGroups();
  }

  findAllServiceCategories() {
    return this.catalogsRepository.findAllServiceCategories();
  }

  findAllTechStacks() {
    return this.catalogsRepository.findAllTechStacks();
  }
}
