import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AUTH_ERRORS } from '../../../common/constants/errors';
import { AppException } from '../../../common/exceptions/app.exception';
import {
  ADMIN_ACCESS_COOKIE_NAME,
  ADMIN_JWT_ACCESS_TYP,
} from '../admin-auth.constants';

import type { AdminJwtAccessPayload } from '../admin-auth.types';
import type { Request } from 'express';

export interface AdminJwtAccessUser {
  adminId: string;
  email: string;
  isSuper: boolean;
}

@Injectable()
export class AdminJwtAccessStrategy extends PassportStrategy(
  Strategy,
  'admin-jwt-access',
) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request): string | null => {
          const token: unknown = req.cookies[ADMIN_ACCESS_COOKIE_NAME];
          return typeof token === 'string' ? token : null;
        },
      ]),
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    });
  }

  validate(payload: AdminJwtAccessPayload): AdminJwtAccessUser {
    if (payload.typ !== ADMIN_JWT_ACCESS_TYP) {
      throw new AppException(AUTH_ERRORS.ACCESS_TOKEN_INVALID);
    }

    return {
      adminId: payload.sub,
      email: payload.email,
      isSuper: payload.isSuper,
    };
  }
}
