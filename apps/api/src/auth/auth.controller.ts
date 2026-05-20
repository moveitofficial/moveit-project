import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  AUTH_ERRORS,
  COMMON_ERRORS,
  OAUTH_ERRORS,
  USER_ERRORS,
} from '../common/constants/errors';
import { ApiErrorResponse } from '../common/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from '../common/decorators/api-success-response.decorator';
import { JwtRefresh } from '../common/decorators/jwt-refresh.decorator';

import { OAUTH_SIGNUP_COOKIE_NAME } from './auth.constants';
import { AuthService } from './auth.service';
import { OAuthSignUpRequestDto } from './dto/oauth-signup-request.dto';
import {
  SignInResponseDataDto,
  SignUpResponseDataDto,
} from './dto/response.dto';
import { SignInRequestDto } from './dto/sign-in-request.dto';
import { SignUpRequestDto } from './dto/sign-up-request.dto';

import type { JwtRefreshUser } from './jwt/jwt-refresh.strategy';
import type { Request, Response } from 'express';

interface OAuthSignupRequest {
  cookies?: Record<string, string | undefined>;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '이메일 회원가입 (LOCAL)' })
  @ApiSuccessResponse(HttpStatus.CREATED, SignUpResponseDataDto)
  @ApiErrorResponse(AUTH_ERRORS.DUPLICATE_EMAIL)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signUp(@Body() body: SignUpRequestDto) {
    return this.authService.signUpWithEmail(body);
  }

  @ApiOperation({ summary: '이메일 로그인 (LOCAL)' })
  @ApiSuccessResponse(HttpStatus.OK, SignInResponseDataDto)
  @ApiErrorResponse(AUTH_ERRORS.INVALID_CREDENTIALS)
  @ApiErrorResponse(COMMON_ERRORS.BLOCKED, USER_ERRORS.DELETED)
  @ApiErrorResponse(USER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(
    @Body() body: SignInRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.signInWithEmail(body);
    this.authService.setAuthCookies(res, accessToken, refreshToken);
    return { user };
  }

  @ApiOperation({
    summary: 'OAuth 가입 완료 (role 확정)',
    description:
      'OAuth 콜백에서 httpOnly 쿠키로 저장된 signupToken과 요청 body의 role로 최종 가입을 완료합니다.',
  })
  @ApiSuccessResponse(HttpStatus.CREATED, SignInResponseDataDto)
  @ApiErrorResponse(
    OAUTH_ERRORS.OAUTH_SIGNUP_TOKEN_INVALID,
    OAUTH_ERRORS.OAUTH_SIGNUP_TOKEN_EXPIRED,
  )
  @ApiErrorResponse(OAUTH_ERRORS.OAUTH_DUPLICATE_EMAIL)
  @ApiErrorResponse(COMMON_ERRORS.BLOCKED, USER_ERRORS.DELETED)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @HttpCode(HttpStatus.CREATED)
  @Post('oauth/signup')
  async oauthSignUp(
    @Body() body: OAuthSignUpRequestDto,
    @Req()
    req: OAuthSignupRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const signupToken = req.cookies?.[OAUTH_SIGNUP_COOKIE_NAME];
    const { user, accessToken, refreshToken } =
      await this.authService.completeOAuthSignup(signupToken, body.role);
    this.authService.clearOAuthSignupCookie(res);
    this.authService.setAuthCookies(res, accessToken, refreshToken);
    return { user };
  }

  @ApiOperation({
    summary: '액세스 토큰 갱신',
    description:
      'httpOnly 쿠키의 refresh 토큰으로 access 토큰을 재발급합니다. refresh 쿠키는 그대로 유지됩니다.',
  })
  @ApiSuccessResponse(HttpStatus.OK, SignInResponseDataDto)
  @ApiErrorResponse(
    AUTH_ERRORS.TOKEN_EXPIRED,
    AUTH_ERRORS.REFRESH_TOKEN_INVALID,
  )
  @ApiErrorResponse(COMMON_ERRORS.BLOCKED, USER_ERRORS.DELETED)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @HttpCode(HttpStatus.OK)
  @JwtRefresh()
  @Post('refresh')
  async refresh(
    @Req() req: Request & { user: JwtRefreshUser },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken } = await this.authService.refreshAccessToken(
      req.user.userId,
    );
    this.authService.setAccessCookie(res, accessToken);
    return { user };
  }

  @ApiOperation({ summary: '로그아웃' })
  @ApiSuccessResponse(HttpStatus.NO_CONTENT)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('signout')
  signOut(@Res({ passthrough: true }) res: Response): void {
    this.authService.clearAuthCookies(res);
  }
}
