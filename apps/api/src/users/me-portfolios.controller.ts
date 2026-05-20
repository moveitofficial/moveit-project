import { Body, Controller, HttpStatus, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { JwtAccessUser } from '../auth/jwt/jwt-access.strategy';
import {
  COMMON_ERRORS,
  EXPERT_PROFILE_ERRORS,
  PORTFOLIO_ERRORS,
} from '../common/constants/errors';
import { ApiErrorResponse } from '../common/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from '../common/decorators/api-success-response.decorator';
import { RoleAuth } from '../common/decorators/jwt-auth.decorator';
import { PortfolioRequestDto } from '../portfolios/dto/portfolio-request.dto';
import { PortfolioCreateResponseDto } from '../portfolios/dto/portfolio-response.dto';
import { PortfoliosService } from '../portfolios/portfolios.service';

import type { Request } from 'express';

@ApiTags('users/me/portfolios')
@Controller('users/me/portfolios')
export class MePortfoliosController {
  constructor(private readonly portfoliosService: PortfoliosService) {}

  @ApiOperation({ summary: '포트폴리오 등록' })
  @RoleAuth(Role.EXPERT)
  @ApiSuccessResponse(HttpStatus.CREATED, PortfolioCreateResponseDto)
  @ApiErrorResponse(
    COMMON_ERRORS.VALIDATION_ERROR,
    PORTFOLIO_ERRORS.MAIN_IMAGE_REQUIRED,
    PORTFOLIO_ERRORS.DETAIL_IMAGE_INVALID,
    PORTFOLIO_ERRORS.MISSING_STACK_TYPE,
  )
  @ApiErrorResponse(EXPERT_PROFILE_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Post()
  create(@Req() req: Request, @Body() dto: PortfolioRequestDto) {
    const user = req.user as JwtAccessUser;
    return this.portfoliosService.create(user.userId, dto);
  }
}
