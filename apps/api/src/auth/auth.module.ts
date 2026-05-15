import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from '../users/users.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OAuthController } from './oauth.controller';
import { GoogleGuard } from './oauth/google-guard';
import { GoogleOAuthStartGuard } from './oauth/google-oauth-start.guard';
import { GoogleStrategy } from './oauth/google-strategy';
import { JwtAccessGuard } from './jwt/jwt-access.guard';
import { JwtAccessStrategy } from './jwt/jwt-access.strategy';
import { JwtRefreshGuard } from './jwt/jwt-refresh.guard';
import { JwtRefreshStrategy } from './jwt/jwt-refresh.strategy';

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
    JwtAccessStrategy,
    JwtRefreshStrategy,
    JwtAccessGuard,
    JwtRefreshGuard,
  ],
  exports: [JwtAccessGuard, JwtRefreshGuard],
})
export class AuthModule {}
