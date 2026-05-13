import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ACCESS_COOKIE_NAME, JWT_ACCESS_TYP } from '../auth.constants';

import type { JwtAccessPayload } from '../auth.types';
import type { Role } from '@prisma/client';
import type { Request } from 'express';

export interface JwtAccessUser {
  userId: string;
  email: string;
  role: Role;
}

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request): string | null => {
          const token: unknown = req.cookies[ACCESS_COOKIE_NAME];
          return typeof token === 'string' ? token : null;
        },
      ]),
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    });
  }

  validate(payload: JwtAccessPayload): JwtAccessUser {
    if (payload.typ !== JWT_ACCESS_TYP) {
      throw new UnauthorizedException();
    }

    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
