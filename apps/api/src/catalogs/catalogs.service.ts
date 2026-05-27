import { Injectable } from '@nestjs/common';

import { toListResponse } from '../common/utils/list-response.util';

import { CatalogsRepository } from './catalogs.repository';

@Injectable()
export class CatalogsService {
  constructor(private readonly catalogsRepository: CatalogsRepository) {}

  findAllServiceGroups() {
    return this.catalogsRepository.findAllServiceGroups().then(toListResponse);
  }

  findAllServiceCategories() {
    return this.catalogsRepository
      .findAllServiceCategories()
      .then(toListResponse);
  }

  findAllTechStacks() {
    return this.catalogsRepository.findAllTechStacks().then(toListResponse);
  }
}
