import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from '../users/users.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAccessGuard } from './jwt/jwt-access.guard';
import { JwtAccessStrategy } from './jwt/jwt-access.strategy';
import { JwtRefreshGuard } from './jwt/jwt-refresh.guard';
import { JwtRefreshStrategy } from './jwt/jwt-refresh.strategy';
import { OptionalJwtAccessGuard } from './jwt/optional-jwt-access.guard';
import { GoogleGuard } from './oauth/google/google.guard';
import { GoogleOAuthStartGuard } from './oauth/google/google.oauth.start.guard';
import { GoogleStrategy } from './oauth/google/google.strategy';
import { KakaoGuard } from './oauth/kakao/kakao.guard';
import { KakaoOAuthStartGuard } from './oauth/kakao/kakao.oauth.start.guard';
import { KakaoStrategy } from './oauth/kakao/kakao.strategy';
import { NaverGuard } from './oauth/naver/naver.guard';
import { NaverOAuthStartGuard } from './oauth/naver/naver.oauth.start.guard';
import { NaverStrategy } from './oauth/naver/naver.strategy';
import { OAuthController } from './oauth.controller';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [AuthController, OAuthController],
  providers: [
    AuthService,
    GoogleStrategy,
    GoogleOAuthStartGuard,
    GoogleGuard,
    KakaoStrategy,
    KakaoOAuthStartGuard,
    KakaoGuard,
    NaverStrategy,
    NaverOAuthStartGuard,
    NaverGuard,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    JwtAccessGuard,
    OptionalJwtAccessGuard,
    JwtRefreshGuard,
  ],
  exports: [JwtAccessGuard, OptionalJwtAccessGuard, JwtRefreshGuard],
})
export class AuthModule {}
