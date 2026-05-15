import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { GoogleGuard } from './oauth/google-guard';
import { GoogleOAuthStartGuard } from './oauth/google-oauth-start.guard';

import type { OAuthProfile } from './oauth/oauth-user';
import type { Request, Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class OAuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleOAuthStartGuard)
  @ApiOperation({ summary: '구글 OAuth 로그인 시작' })
  googleStart(): void {
    // Guard가 Google authorize URL로 리다이렉트
  }

  @Get('google/callback')
  @UseGuards(GoogleGuard)
  @ApiOperation({ summary: '구글 OAuth 콜백' })
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

      res.redirect(
        this.authService.getOAuthSignupRedirectUrl(result.signupToken),
      );
    } catch (error: unknown) {
      res.redirect(this.authService.getOAuthFailureRedirectUrl(error));
    }
  }
}
