import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  COMMON_ERRORS,
  EXPERT_PROFILE_ERRORS,
  USER_ERRORS,
} from '../common/constants/errors';
import { ApiErrorResponse } from '../common/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from '../common/decorators/api-success-response.decorator';
import { PortfolioListResponseDto } from '../portfolios/dto/portfolio-response.dto';

import { UsersService } from './users.service';

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
}
