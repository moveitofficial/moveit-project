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
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AUTH_ERRORS, USER_ERRORS } from '../common/constants/errors';
import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { errorResponseExample } from '../common/swagger/error-response-example';

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
    type: ErrorResponseDto,
    example: errorResponseExample(AUTH_ERRORS.DUPLICATE_EMAIL),
  })
  @ApiInternalServerErrorResponse({
    description: AUTH_ERRORS.INTERNAL_SERVER_ERROR.message,
    type: ErrorResponseDto,
    example: errorResponseExample(AUTH_ERRORS.INTERNAL_SERVER_ERROR),
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '이메일 회원가입 (LOCAL)' })
  @Post('sign-up')
  async signUp(@Body() body: SignUpRequestDto) {
    return this.authService.signUpWithEmail(body);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: '로그인 성공',
    type: signInHttpResponseDto,
  })
  @ApiConflictResponse({
    description: AUTH_ERRORS.DUPLICATE_EMAIL.message,
    type: ErrorResponseDto,
    example: errorResponseExample(AUTH_ERRORS.DUPLICATE_EMAIL),
  })
  @ApiUnauthorizedResponse({
    description: AUTH_ERRORS.INVALID_CREDENTIALS.message,
    type: ErrorResponseDto,
    example: errorResponseExample(AUTH_ERRORS.INVALID_CREDENTIALS),
  })
  @ApiForbiddenResponse({
    description: AUTH_ERRORS.BLOCKED.message,
    type: ErrorResponseDto,
    example: errorResponseExample(AUTH_ERRORS.BLOCKED),
  })
  @ApiUnauthorizedResponse({
    description: AUTH_ERRORS.TOKEN_EXPIRED.message,
    type: ErrorResponseDto,
    example: errorResponseExample(AUTH_ERRORS.TOKEN_EXPIRED),
  })
  @ApiUnauthorizedResponse({
    description: AUTH_ERRORS.REFRESH_TOKEN_INVALID.message,
    type: ErrorResponseDto,
    example: errorResponseExample(AUTH_ERRORS.REFRESH_TOKEN_INVALID),
  })
  @ApiNotFoundResponse({
    description: USER_ERRORS.NOT_FOUND.message,
    type: ErrorResponseDto,
    example: errorResponseExample(USER_ERRORS.NOT_FOUND),
  })
  @ApiInternalServerErrorResponse({
    description: USER_ERRORS.INTERNAL_SERVER_ERROR.message,
    type: ErrorResponseDto,
    example: errorResponseExample(USER_ERRORS.INTERNAL_SERVER_ERROR),
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
