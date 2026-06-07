import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  AUTH_ERRORS,
  COMMON_ERRORS,
  USER_ERRORS,
} from '../../common/constants/errors';
import { ApiErrorResponse } from '../../common/decorators/api-error-response.decorator';
import {
  ApiPaginatedResponse,
  ApiSuccessResponse,
} from '../../common/decorators/api-success-response.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { AppException } from '../../common/exceptions/app.exception';
import { Paginated } from '../../common/types/paginated.type';
import { ActivityItemDto } from '../admin-activity/dto/activity-item.dto';
import { AdminJwtAccessGuard } from '../admin-auth/jwt/admin-jwt-access.guard';
import { AdminSuperGuard } from '../admin-auth/jwt/admin-super.guard';

import { AdminAccountService } from './admin-account.service';
import { AdminDetailResponseDto } from './dto/admin-detail-response.dto';
import { CreateAdminRequestDto } from './dto/create-admin-request.dto';
import { CreateAdminResponseDataDto } from './dto/create-admin-response.dto';
import { GetAdminsQueryDto } from './dto/list/admins-query.dto';
import { AdminItemDto } from './dto/list/admins-response.dto';

@ApiTags('admin-account')
@Controller('admin/accounts')
export class AdminAccountController {
  constructor(private readonly adminAccountService: AdminAccountService) {}

  @ApiOperation({ summary: '관리자 등록 (슈퍼관리자 전용)' })
  @ApiSuccessResponse(HttpStatus.CREATED, CreateAdminResponseDataDto)
  @ApiErrorResponse(AUTH_ERRORS.DUPLICATE_EMAIL)
  @ApiErrorResponse(COMMON_ERRORS.FORBIDDEN)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AdminJwtAccessGuard, AdminSuperGuard)
  @Post()
  async createAdmin(@Body() body: CreateAdminRequestDto) {
    const admin = await this.adminAccountService.createAdmin(body);
    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      isSuper: admin.isSuper,
      mustChangePassword: admin.mustChangePassword,
    };
  }

  @ApiOperation({ summary: '관리자 비밀번호 초기화 (슈퍼관리자 전용)' })
  @ApiSuccessResponse(HttpStatus.NO_CONTENT)
  @ApiErrorResponse(COMMON_ERRORS.FORBIDDEN)
  @ApiErrorResponse(USER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AdminJwtAccessGuard, AdminSuperGuard)
  @Post(':id/password-reset')
  async resetPassword(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () => new AppException(USER_ERRORS.NOT_FOUND),
      }),
    )
    id: string,
  ): Promise<void> {
    await this.adminAccountService.resetPasswordById(id);
  }

  @ApiOperation({
    summary: '[어드민] 관리자 리스트',
    description:
      '슈퍼관리자 제외, 이름·이메일 부분 일치 검색 (대소문자 무시), 등록일(createdAt) desc.',
  })
  @ApiPaginatedResponse(HttpStatus.OK, AdminItemDto)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @Get()
  getAdmins(
    @Query() query: GetAdminsQueryDto,
  ): Promise<Paginated<AdminItemDto>> {
    return this.adminAccountService.getAdmins(query);
  }

  @ApiOperation({ summary: '[어드민] 관리자 상세 (기본정보)' })
  @ApiSuccessResponse(HttpStatus.OK, AdminDetailResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(USER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @Get(':id')
  getAdminDetail(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () => new AppException(USER_ERRORS.NOT_FOUND),
      }),
    )
    id: string,
  ): Promise<AdminDetailResponseDto> {
    return this.adminAccountService.getAdminDetail(id);
  }

  @ApiOperation({
    summary: '[어드민] 관리자 활동로그',
    description: '해당 관리자가 수행한 활동로그, 최신순 (createdAt desc).',
  })
  @ApiPaginatedResponse(HttpStatus.OK, ActivityItemDto)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(USER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @Get(':id/activities')
  getAdminActivities(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () => new AppException(USER_ERRORS.NOT_FOUND),
      }),
    )
    id: string,
    @Query() query: PaginationQueryDto,
  ): Promise<Paginated<ActivityItemDto>> {
    return this.adminAccountService.getAdminActivities(id, query);
  }
}
