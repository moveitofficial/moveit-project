import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { COMMON_ERRORS, USER_ERRORS } from '../../common/constants/errors';
import { ApiErrorResponse } from '../../common/decorators/api-error-response.decorator';
import {
  ApiPaginatedResponse,
  ApiSuccessResponse,
} from '../../common/decorators/api-success-response.decorator';
import { AppException } from '../../common/exceptions/app.exception';
import { type Paginated } from '../../common/types/paginated.type';
import { AdminJwtAccessGuard } from '../admin-auth/jwt/admin-jwt-access.guard';

import { AdminUserService } from './admin-user.service';
import { UserDetailResponseDto } from './dto/user-detail-response.dto';
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

  @ApiOperation({ summary: '어드민 유저 상세 (일반/판매자 통합)' })
  @ApiSuccessResponse(HttpStatus.OK, UserDetailResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(USER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @Get(':id')
  getUserDetail(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () => new AppException(USER_ERRORS.NOT_FOUND),
      }),
    )
    id: string,
  ): Promise<UserDetailResponseDto> {
    return this.adminUserService.getUserDetail(id);
  }
}
