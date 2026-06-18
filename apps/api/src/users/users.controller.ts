import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Query,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  COMMON_ERRORS,
  EXPERT_PROFILE_ERRORS,
  SERVICE_ERRORS,
  USER_ERRORS,
} from '../common/constants/errors';
import { ApiErrorResponse } from '../common/decorators/api-error-response.decorator';
import {
  ApiPaginatedResponse,
  ApiSuccessResponse,
} from '../common/decorators/api-success-response.decorator';
import { OptionalJwtAuth } from '../common/decorators/jwt-auth.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Paginated } from '../common/types/paginated.type';
import { PortfolioListResponseDto } from '../portfolios/dto/portfolio-response.dto';
import { ExpertServiceListItemResponseDto } from '../services/dto/service-response.dto';
import { ExpertServiceListItemResponse } from '../services/services.mapper';

import { ExpertDetailResponseDto } from './dto/expert-detail-response.dto';
import { UsersService } from './users.service';

import type { JwtAccessUser } from '../auth/jwt/jwt-access.strategy';
import type { Request } from 'express';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '전문가 상세 조회' })
  @OptionalJwtAuth()
  @ApiSuccessResponse(HttpStatus.OK, ExpertDetailResponseDto)
  @ApiErrorResponse(USER_ERRORS.NOT_FOUND, EXPERT_PROFILE_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Get(':id')
  getExpertDetail(
    @Param('id', ParseUUIDPipe) expertUserId: string,
    @Req() req: Request,
  ) {
    const viewer = req.user as JwtAccessUser | undefined;
    return this.usersService.getExpertDetail(
      expertUserId,
      viewer ? { userId: viewer.userId, role: viewer.role } : undefined,
    );
  }

  @ApiOperation({ summary: '유저(전문가) 포트폴리오 목록 조회하기' })
  @ApiSuccessResponse(HttpStatus.OK, PortfolioListResponseDto)
  @ApiErrorResponse(USER_ERRORS.NOT_FOUND, EXPERT_PROFILE_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Get(':id/portfolios')
  getPortfoliosByUserId(@Param('id') userId: string) {
    return this.usersService.getUserWithPortfolios(userId);
  }

  @ApiOperation({ summary: '유저(전문가) 서비스 조회하기' })
  @ApiPaginatedResponse(HttpStatus.OK, ExpertServiceListItemResponseDto)
  @ApiErrorResponse(USER_ERRORS.NOT_FOUND, EXPERT_PROFILE_ERRORS.NOT_FOUND)
  @ApiErrorResponse(SERVICE_ERRORS.FORBIDDEN_NOT_EXPERT)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Get(':id/services')
  getAllServicesByUserId(
    @Param('id', ParseUUIDPipe) userId: string,
    @Query() query: PaginationQueryDto,
  ): Promise<Paginated<ExpertServiceListItemResponse>> {
    return this.usersService.getUserWithServices(userId, query);
  }
}
