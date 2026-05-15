import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiSuccessResponse } from '../common/decorators/api-success-response.decorator';

import { CatalogsService } from './catalogs.service';
import {
  ServiceCategoryListResponseDto,
  ServiceGroupListResponseDto,
  TechStackListResponseDto,
} from './dto/response.dto';

@ApiTags('catalogs')
@Controller('catalogs')
export class CatalogsController {
  constructor(private readonly catalogsService: CatalogsService) {}

  @ApiOperation({ summary: '모든 서비스 그룹 조회' })
  @ApiSuccessResponse(HttpStatus.OK, ServiceGroupListResponseDto)
  @Get('/groups')
  getAllServiceGroups() {
    return this.catalogsService.findAllServiceGroups();
  }

  @ApiOperation({ summary: '모든 서비스 카테고리 조회' })
  @ApiSuccessResponse(HttpStatus.OK, ServiceCategoryListResponseDto)
  @Get('/categories')
  getAllServiceCategories() {
    return this.catalogsService.findAllServiceCategories();
  }

  @ApiOperation({ summary: '모든 기술스택 조회' })
  @ApiSuccessResponse(HttpStatus.OK, TechStackListResponseDto)
  @Get('/tech-stacks')
  getAllTechStacks() {
    return this.catalogsService.findAllTechStacks();
  }
}
