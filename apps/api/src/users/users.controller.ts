import { Controller, Get, HttpStatus, Param, Query, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAccessUser } from '../auth/jwt/jwt-access.strategy';
import {
  COMMON_ERRORS,
  EXPERT_PROFILE_ERRORS,
  USER_ERRORS,
} from '../common/constants/errors';
import { ApiErrorResponse } from '../common/decorators/api-error-response.decorator';
import {
  ApiPaginatedResponse,
  ApiSuccessResponse,
} from '../common/decorators/api-success-response.decorator';
import { JwtAuth } from '../common/decorators/jwt-auth.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PortfolioListResponseDto } from '../portfolios/dto/portfolio-response.dto';
import { ReviewResponseDto } from '../services/dto/service-response.dto';

import { UsersService } from './users.service';

import type { Request } from 'express';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '모든 유저 조회하기' })
  @Get('')
  getAllUser() {
    return this.usersService.getAllUser();
  }

  @ApiOperation({ summary: '유저(전문가) 포트폴리오 조회하기' })
  @ApiSuccessResponse(HttpStatus.OK, PortfolioListResponseDto)
  @ApiErrorResponse(USER_ERRORS.NOT_FOUND, EXPERT_PROFILE_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Get(':id/portfolios')
  getPortfoliosByUserId(@Param('id') userId: string) {
    return this.usersService.getUserWithPortfolios(userId);
  }

  @ApiOperation({ summary: '유저 리뷰 목록 불러오기' })
  @JwtAuth()
  @ApiPaginatedResponse(HttpStatus.OK, ReviewResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.VALIDATION_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Get('me/reviews')
  getMyReviews(@Req() req: Request, @Query() query: PaginationQueryDto) {
    const user = req.user as JwtAccessUser;
    return this.usersService.getAllReviewsByUserId(user.userId, query);
  }
}
