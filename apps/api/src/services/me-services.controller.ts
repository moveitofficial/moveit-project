import { Controller, Get, HttpStatus, Query, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { JwtAccessUser } from '../auth/jwt/jwt-access.strategy';
import { COMMON_ERRORS } from '../common/constants/errors';
import { ApiErrorResponse } from '../common/decorators/api-error-response.decorator';
import {
  ApiPaginatedResponse,
  ApiSuccessResponse,
} from '../common/decorators/api-success-response.decorator';
import { JwtAuth, RoleAuth } from '../common/decorators/jwt-auth.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

import {
  ExpertServiceListItemResponseDto,
  ServiceListItemResponseDto,
} from './dto/service-response.dto';
import { ServicesService } from './services.service';

import type { Request } from 'express';

@ApiTags('users/me')
@Controller('users/me')
export class MeServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @ApiOperation({
    summary: '내가 최근 본 서비스 (메인용)',
    description:
      'viewedAt desc 최근 4개. 본 게 1개일 땐 같은 카테고리 ACTIVE 서비스 3개로 보충해서 총 4개.',
  })
  @ApiSuccessResponse(HttpStatus.OK, [ServiceListItemResponseDto])
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @JwtAuth()
  @Get('recently-viewed-services')
  getMyRecentlyViewedServices(@Req() req: Request) {
    const user = req.user as JwtAccessUser;
    return this.servicesService.getMyRecentlyViewedServices(user.userId);
  }

  @ApiOperation({ summary: '내 서비스 목록 조회 (전문가용)' })
  @ApiPaginatedResponse(HttpStatus.OK, ExpertServiceListItemResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @RoleAuth(Role.EXPERT)
  @Get('services')
  getMyServices(@Req() req: Request, @Query() query: PaginationQueryDto) {
    const user = req.user as JwtAccessUser;
    return this.servicesService.getMyServices(user.userId, query);
  }
}
