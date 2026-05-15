import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  AUTH_ERRORS,
  COMMON_ERRORS,
  USER_ERRORS,
} from '../common/constants/errors';
import { ApiErrorResponse } from '../common/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from '../common/decorators/api-success-response.decorator';

import { AuthService } from './auth.service';
import {
  signInHttpResponseDto,
  SignUpHttpResponseDto,
} from './dto/response.dto';
import { SignInRequestDto } from './dto/sign-in-request.dto';
import { SignUpRequestDto } from './dto/sign-up-request.dto';

import type { Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '이메일 회원가입 (LOCAL)' })
  @ApiSuccessResponse(HttpStatus.CREATED, SignUpHttpResponseDto)
  @ApiErrorResponse(AUTH_ERRORS.DUPLICATE_EMAIL)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  async signUp(@Body() body: SignUpRequestDto) {
    return this.authService.signUpWithEmail(body);
  }

  @ApiOperation({ summary: '이메일 로그인 (LOCAL)' })
  @ApiSuccessResponse(HttpStatus.OK, signInHttpResponseDto)
  @ApiErrorResponse(AUTH_ERRORS.INVALID_CREDENTIALS)
  @ApiErrorResponse(AUTH_ERRORS.BLOCKED)
  @ApiErrorResponse(USER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(
    @Body() body: SignInRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.signInWithEmail(body);
    this.authService.setAuthCookies(res, accessToken, refreshToken);
    return { user };
  }
}
