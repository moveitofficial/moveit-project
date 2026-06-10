import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  Patch,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  AUTH_ERRORS,
  COMMON_ERRORS,
  USER_ERRORS,
} from '../../common/constants/errors';
import { ApiErrorResponse } from '../../common/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from '../../common/decorators/api-success-response.decorator';

import { AdminAuthService } from './admin-auth.service';
import { AdminSignInRequestDto } from './dto/admin-sign-in-request.dto';
import { AdminSignInResponseDataDto } from './dto/admin-sign-in-response.dto';
import { AdminUpdatePasswordRequestDto } from './dto/admin-update-password-request.dto';
import { AdminJwtAuth } from './jwt/admin-jwt-auth.decorator';

import type { AdminJwtAccessUser } from './jwt/admin-jwt-access.strategy';
import type { Request, Response } from 'express';

@ApiTags('admin-auth')
@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @ApiOperation({ summary: '관리자 로그인' })
  @ApiSuccessResponse(HttpStatus.OK, AdminSignInResponseDataDto)
  @ApiErrorResponse(AUTH_ERRORS.INVALID_CREDENTIALS)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(
    @Body() body: AdminSignInRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { admin, accessToken, refreshToken } =
      await this.adminAuthService.signIn(body);
    this.adminAuthService.setAuthCookies(res, accessToken, refreshToken);
    return { admin };
  }

  @ApiOperation({ summary: '관리자 로그아웃' })
  @ApiSuccessResponse(HttpStatus.NO_CONTENT)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('signout')
  signout(@Res({ passthrough: true }) res: Response): void {
    this.adminAuthService.clearAuthCookies(res);
  }

  @ApiOperation({
    summary: '관리자 비밀번호 변경',
    description:
      '최초 로그인 또는 비밀번호 초기화 후 임시 비밀번호로 로그인한 관리자가 비밀번호를 변경합니다. 성공 시 mustChangePassword 가 false 로 갱신됩니다.',
  })
  @ApiSuccessResponse(HttpStatus.OK)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(COMMON_ERRORS.VALIDATION_ERROR)
  @ApiErrorResponse(USER_ERRORS.INVALID_PASSWORD)
  @ApiErrorResponse(USER_ERRORS.PASSWORD_MISMATCH)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @AdminJwtAuth()
  @HttpCode(HttpStatus.OK)
  @Patch('password')
  updatePassword(
    @Req() req: Request & { user: AdminJwtAccessUser },
    @Body() dto: AdminUpdatePasswordRequestDto,
  ): Promise<void> {
    const { adminId } = req.user;
    return this.adminAuthService.updatePassword(adminId, dto);
  }
}
