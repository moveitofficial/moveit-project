import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CatalogsService } from './catalogs.service';

@ApiTags('catalogs')
@Controller('catalogs')
export class CatalogsController {
  constructor(private readonly catalogsService: CatalogsService) {}

  @ApiOperation({ summary: '모든 서비스 그룹 조회' })
  @Get('/groups')
  getAllServiceGroups() {
    return this.catalogsService.findAllServiceGroups();
  }

  @ApiOperation({ summary: '모든 서비스 카테고리 조회' })
  @Get('/categories')
  getAllServiceCategories() {
    return this.catalogsService.findAllServiceCategories();
  }

  @ApiOperation({ summary: '모든 기술스택 조회' })
  @Get('/tech-stacks')
  getAllTechStacks() {
    return this.catalogsService.findAllTechStacks();
  }
}
