import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  CATEGORY_FEATURED_ERRORS,
  COMMON_ERRORS,
} from '../../common/constants/errors';
import { ApiErrorResponse } from '../../common/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from '../../common/decorators/api-success-response.decorator';
import { AdminJwtAuth } from '../admin-auth/jwt/admin-jwt-auth.decorator';
import { ServiceCandidatesResponseDto } from '../admin-main-setting/dto/candidates-response.dto';

import { AdminCategoryFeaturedService } from './admin-category-featured.service';
import { GetCategoryFeaturedCandidatesQueryDto } from './dto/candidates-query.dto';
import { DeleteCategoryFeaturedDto } from './dto/delete-request.dto';
import { CategoryFeaturedPageResponseDto } from './dto/page-response.dto';
import { RegisterCategoryFeaturedDto } from './dto/register-request.dto';

import type { AdminJwtAccessUser } from '../admin-auth/jwt/admin-jwt-access.strategy';
import type { Request } from 'express';

@ApiTags('admin-category-featured')
@Controller('admin/category-featured')
export class AdminCategoryFeaturedController {
  constructor(
    private readonly adminCategoryFeaturedService: AdminCategoryFeaturedService,
  ) {}

  @ApiOperation({
    summary: '[어드민] 카테고리 대표서비스 현재 등록 목록',
    description:
      'IT코칭 / 프로젝트의뢰 두 그룹의 현재 등록된 대표서비스 통합 조회.',
  })
  @ApiSuccessResponse(HttpStatus.OK, CategoryFeaturedPageResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @AdminJwtAuth()
  @Get()
  getAll(): Promise<CategoryFeaturedPageResponseDto> {
    return this.adminCategoryFeaturedService.getAll();
  }

  @ApiOperation({
    summary: '[어드민] 서비스 후보 리스트 (등록 모달용)',
    description:
      'serviceGroup별 후보. 각 항목에 isAlreadyRegistered 플래그 + 현재 등록된 서비스 목록(registered) 포함.',
  })
  @ApiSuccessResponse(HttpStatus.OK, ServiceCandidatesResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @AdminJwtAuth()
  @Get('candidates')
  getCandidates(
    @Query() query: GetCategoryFeaturedCandidatesQueryDto,
  ): Promise<ServiceCandidatesResponseDto> {
    return this.adminCategoryFeaturedService.getCandidates(query);
  }

  @ApiOperation({
    summary: '[어드민] 카테고리 대표서비스 등록',
    description:
      '한 호출 = 한 serviceGroup. 그룹당 최대 4개. 한도/group 일치/중복 검증.',
  })
  @ApiSuccessResponse(HttpStatus.CREATED)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(CATEGORY_FEATURED_ERRORS.LIMIT_EXCEEDED)
  @ApiErrorResponse(CATEGORY_FEATURED_ERRORS.DUPLICATE)
  @ApiErrorResponse(CATEGORY_FEATURED_ERRORS.GROUP_MISMATCH)
  @ApiErrorResponse(CATEGORY_FEATURED_ERRORS.TARGET_NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @AdminJwtAuth()
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async register(
    @Body() body: RegisterCategoryFeaturedDto,
    @Req() req: Request,
  ): Promise<void> {
    const { adminId } = req.user as AdminJwtAccessUser;
    await this.adminCategoryFeaturedService.register(body, adminId);
  }

  @ApiOperation({
    summary: '[어드민] 카테고리 대표서비스 삭제',
    description:
      '한 호출 = 한 serviceGroup. categoryFeaturedIds 다중. 존재·serviceGroup 일치 검증.',
  })
  @ApiSuccessResponse(HttpStatus.OK)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(CATEGORY_FEATURED_ERRORS.NOT_FOUND)
  @ApiErrorResponse(CATEGORY_FEATURED_ERRORS.GROUP_MISMATCH_ON_DELETE)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @AdminJwtAuth()
  @HttpCode(HttpStatus.OK)
  @Delete()
  async delete(
    @Body() body: DeleteCategoryFeaturedDto,
    @Req() req: Request,
  ): Promise<void> {
    const { adminId } = req.user as AdminJwtAccessUser;
    await this.adminCategoryFeaturedService.delete(body, adminId);
  }
}
