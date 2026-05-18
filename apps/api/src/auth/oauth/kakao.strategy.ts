import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(config: ConfigService) {
    super({
      clientID: config.getOrThrow<string>('KAKAO_CLIENT_ID'),
      clientSecret: config.getOrThrow<string>('KAKAO_CLIENT_SECRET'),
      callbackURL: config.getOrThrow<string>('KAKAO_CALLBACK_URL'),
    });
  }
}
