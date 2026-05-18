import {
  Controller,
  Get,
  HttpStatus,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { GoogleGuard } from './oauth/google.guard';
import { GoogleOAuthStartGuard } from './oauth/google.oauth.start.guard';

import type { OAuthProfile } from './oauth/oauth.types';
import type { Request, Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class OAuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleOAuthStartGuard)
  @ApiOperation({
    summary: '구글 OAuth 로그인 시작',
    description:
      'Google 인증 페이지로 리다이렉트합니다. role은 이 단계에서 받지 않습니다.',
  })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Google OAuth 인증 페이지로 리다이렉트',
  })
  googleStart(): void {
    // Guard가 Google authorize URL로 리다이렉트
  }

  @Get('google/callback')
  @UseGuards(GoogleGuard)
  @ApiOperation({
    summary: '구글 OAuth 콜백',
    description: [
      'Google OAuth 인증 후 호출되는 콜백입니다.',
      '기존 OAuth 유저는 access/refresh 쿠키를 발급하고 OAUTH_SUCCESS_REDIRECT_URL로 이동합니다.',
      '신규 유저는 signupToken을 httpOnly 쿠키로 저장하고 OAUTH_SIGNUP_REDIRECT_URL로 이동합니다.',
      '실패 시 OAUTH_FAILURE_REDIRECT_URL?code=... 형태로 이동합니다.',
    ].join('\n'),
  })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description:
      '기존 유저: 성공 URL / 신규 유저: role 선택 URL / 실패: 실패 URL로 리다이렉트',
  })
  async googleCallback(
    @Req() req: Request & { user: OAuthProfile },
    @Query('state') state: string | undefined,
    @Res() res: Response,
  ): Promise<void> {
    try {
      this.authService.parseOAuthState(state);
      const result = await this.authService.handleOAuthCallback(req.user);

      if (result.kind === 'login') {
        this.authService.setAuthCookies(
          res,
          result.accessToken,
          result.refreshToken,
        );
        res.redirect(this.authService.getOAuthSuccessRedirectUrl());
        return;
      }

      this.authService.setOAuthSignupCookie(res, result.signupToken);
      res.redirect(this.authService.getOAuthSignupRedirectUrl());
    } catch (error: unknown) {
      res.redirect(this.authService.getOAuthFailureRedirectUrl(error));
    }
  }
}
