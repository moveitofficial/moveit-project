import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AuthProvider } from '@prisma/client';
import { Strategy } from 'passport-oauth2';

import type { OAuthProfile } from '../oauth.types';

const NAVER_AUTHORIZE_URL = 'https://nid.naver.com/oauth2.0/authorize';
const NAVER_TOKEN_URL = 'https://nid.naver.com/oauth2.0/token';
const NAVER_PROFILE_URL = 'https://openapi.naver.com/v1/nid/me';

interface NaverProfileResponse {
  resultcode: string;
  message: string;
  response: {
    id: string;
    email?: string;
    nickname?: string;
    name?: string;
    profile_image?: string;
  };
}

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor(config: ConfigService) {
    const clientID = config.getOrThrow<string>('NAVER_CLIENT_ID');
    const clientSecret = config.getOrThrow<string>('NAVER_CLIENT_SECRET');
    const callbackURL = config.getOrThrow<string>('NAVER_CALLBACK_URL');

    super({
      authorizationURL: NAVER_AUTHORIZE_URL,
      tokenURL: NAVER_TOKEN_URL,
      clientID,
      clientSecret,
      callbackURL,
    });

    this.userProfile = (
      accessToken: string,
      done: (err: Error | null, profile?: NaverProfileResponse) => void,
    ) => {
      void (async () => {
        try {
          const response = await fetch(NAVER_PROFILE_URL, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'X-Naver-Client-Id': clientID,
              'X-Naver-Client-Secret': clientSecret,
            },
          });

          if (!response.ok) {
            done(
              new Error(
                `Naver profile request failed: ${String(response.status)}`,
              ),
            );
            return;
          }

          const json = (await response.json()) as NaverProfileResponse;

          if (json.resultcode !== '00') {
            done(new Error(json.message));
            return;
          }

          done(null, json);
        } catch (error: unknown) {
          done(
            error instanceof Error
              ? error
              : new Error('Naver profile request failed'),
          );
        }
      })();
    };
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: NaverProfileResponse,
  ): OAuthProfile {
    const email = profile.response.email;

    if (!email) {
      throw new UnauthorizedException('Naver account has no email');
    }

    return {
      provider: AuthProvider.NAVER,
      providerId: profile.response.id,
      email,
      name: profile.response.name ?? null,
      profileImageUrl: profile.response.profile_image ?? null,
    };
  }
}
