import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AUTH_ERRORS, COMMON_ERRORS } from '../../common/constants/errors';
import { ApiErrorResponse } from '../../common/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from '../../common/decorators/api-success-response.decorator';

import { AdminAuthService } from './admin-auth.service';
import { AdminSignInRequestDto } from './dto/admin-sign-in-request.dto';
import { AdminSignInResponseDataDto } from './dto/admin-sign-in-response.dto';

import type { Response } from 'express';

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
}
