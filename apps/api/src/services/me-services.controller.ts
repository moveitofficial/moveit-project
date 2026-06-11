import { Controller, Get, HttpStatus, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAccessUser } from '../auth/jwt/jwt-access.strategy';
import { COMMON_ERRORS } from '../common/constants/errors';
import { ApiErrorResponse } from '../common/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from '../common/decorators/api-success-response.decorator';
import { JwtAuth } from '../common/decorators/jwt-auth.decorator';

import { ServiceListItemResponseDto } from './dto/service-response.dto';
import { ServicesService } from './services.service';

import type { Request } from 'express';

@ApiTags('me-services')
@Controller('me')
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
}
