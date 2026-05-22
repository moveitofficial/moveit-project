import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AUTH_ERRORS, COMMON_ERRORS } from '../../common/constants/errors';
import { ApiErrorResponse } from '../../common/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from '../../common/decorators/api-success-response.decorator';
import { AdminJwtAccessGuard } from '../admin-auth/jwt/admin-jwt-access.guard';
import { AdminSuperGuard } from '../admin-auth/jwt/admin-super.guard';

import { AdminAccountService } from './admin-account.service';
import { CreateAdminRequestDto } from './dto/create-admin-request.dto';
import { CreateAdminResponseDataDto } from './dto/create-admin-response.dto';

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
}
