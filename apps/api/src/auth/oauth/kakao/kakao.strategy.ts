import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AuthProvider } from '@prisma/client';
import { type Profile, Strategy } from 'passport-kakao';

import { OAuthProfile } from '../oauth.types';

interface KakaoRawData {
  kakao_account?: {
    email?: string;
  };
  properties?: {
    nickname?: string;
    profile_image?: string;
  };
}

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(config: ConfigService) {
    super({
      clientID: config.getOrThrow<string>('KAKAO_CLIENT_ID'),
      clientSecret: config.getOrThrow<string>('KAKAO_CLIENT_SECRET'),
      callbackURL: config.getOrThrow<string>('KAKAO_CALLBACK_URL'),
    });
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ): OAuthProfile {
    const rawProfile = profile._json as unknown as KakaoRawData;
    const kakaoAccount = rawProfile.kakao_account;
    const properties = rawProfile.properties;
    const email = kakaoAccount?.email;

    if (!email) {
      throw new UnauthorizedException('Kakao account has no email');
    }

    return {
      provider: AuthProvider.KAKAO,
      providerId:
        typeof profile.id === 'string' ? profile.id : String(profile.id),
      email,
      name: properties?.nickname ?? null,
      profileImageUrl: properties?.profile_image ?? null,
    };
  }
}
