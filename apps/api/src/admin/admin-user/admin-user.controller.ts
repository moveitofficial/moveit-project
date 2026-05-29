import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { COMMON_ERRORS } from '../../common/constants/errors';
import { ApiErrorResponse } from '../../common/decorators/api-error-response.decorator';
import {
  ApiPaginatedResponse,
  ApiSuccessResponse,
} from '../../common/decorators/api-success-response.decorator';
import { type Paginated } from '../../common/types/paginated.type';
import { AdminJwtAccessGuard } from '../admin-auth/jwt/admin-jwt-access.guard';

import { AdminUserService } from './admin-user.service';
import { UserCounstDto } from './dto/users-counts-response.dto';
import { GetUsersQueryDto } from './dto/users-query.dto';
import { UserItemDto } from './dto/users-response.dto';

@ApiTags('admin-user')
@Controller('admin/users')
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @ApiOperation({ summary: '어드민 유저 리스트 (일반/판매자탭)' })
  @ApiPaginatedResponse(HttpStatus.OK, UserItemDto)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @Get()
  getUsers(@Query() query: GetUsersQueryDto): Promise<Paginated<UserItemDto>> {
    return this.adminUserService.getUsers(query);
  }

  @ApiOperation({ summary: '어드민 유저 리스트 탭 카운트(전체, 필터무관)' })
  @ApiSuccessResponse(HttpStatus.OK, UserCounstDto)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @Get('counts')
  getCounts(): Promise<UserCounstDto> {
    return this.adminUserService.getCounts();
  }
}
