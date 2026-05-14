import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AUTH_ERRORS } from '../common/constants/errors';
import {
  DuplicateEmailErrorResponseDto,
  InternalServerErrorResponseDto,
} from '../common/dto/error-response.dto';

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

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '요청 성공',
    type: SignUpHttpResponseDto,
  })
  @ApiConflictResponse({
    description: AUTH_ERRORS.DUPLICATE_EMAIL.message,
    type: DuplicateEmailErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: AUTH_ERRORS.INTERNAL_SERVER_ERROR.message,
    type: InternalServerErrorResponseDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '이메일 회원가입 (LOCAL)' })
  @Post('sign-up')
  async signUp(@Body() body: SignUpRequestDto) {
    return this.authService.signUpWithEmail(body);
  }

  @ApiInternalServerErrorResponse({ description: '서버 오류' })
  @ApiConflictResponse({
    description: '이미 가입된 이메일 (AUTH_DUPLICATE_EMAIL)',
  })
  @ApiCreatedResponse({
    description: '로그인 성공',
    type: signInHttpResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '이메일 로그인 (LOCAL)' })
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
