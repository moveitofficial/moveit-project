import { Module } from '@nestjs/common';

import { CatalogsController } from './catalogs.controller';
import { CatalogsRepository } from './catalogs.repository';
import { CatalogsService } from './catalogs.service';

@Module({
  controllers: [CatalogsController],
  providers: [CatalogsService, CatalogsRepository],
  exports: [CatalogsService],
})
export class CatalogsModule {}
