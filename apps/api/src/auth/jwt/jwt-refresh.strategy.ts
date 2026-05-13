import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JWT_REFRESH_TYP, REFRESH_COOKIE_NAME } from '../auth.constants';

import type { JwtRefreshPayload } from '../auth.types';
import type { Request } from 'express';

export interface JwtRefreshUser {
  userId: string;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request): string | null => {
          const token: unknown = req.cookies[REFRESH_COOKIE_NAME];
          return typeof token === 'string' ? token : null;
        },
      ]),
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    });
  }

  validate(payload: JwtRefreshPayload): JwtRefreshUser {
    if (payload.typ !== JWT_REFRESH_TYP) {
      throw new UnauthorizedException();
    }

    return { userId: payload.sub };
  }
}
