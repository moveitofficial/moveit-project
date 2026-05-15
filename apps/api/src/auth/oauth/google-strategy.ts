import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AuthProvider } from '@prisma/client';
import { Strategy, type Profile } from 'passport-google-oauth20';

import type { OAuthProfile } from './oauth-user';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(config: ConfigService) {
    super({
      clientID: config.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      clientSecret: config.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: config.getOrThrow<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ): OAuthProfile {
    const email = profile.emails?.[0]?.value;

    if (!email) {
      throw new UnauthorizedException('Google account has no email');
    }

    return {
      provider: AuthProvider.GOOGLE,
      providerId: profile.id,
      email,
      name: profile.displayName ?? null,
      profileImageUrl: profile.photos?.[0]?.value ?? null,
    };
  }
}
