import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AUTH_ERRORS } from '../../common/constants/errors';
import { AppException } from '../../common/exceptions/app.exception';
import { UsersService } from '../../users/users.service';
import { ACCESS_COOKIE_NAME, JWT_ACCESS_TYP } from '../auth.constants';
import { AuthService } from '../auth.service';

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
  constructor(
    config: ConfigService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {
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

  async validate(payload: JwtAccessPayload): Promise<JwtAccessUser> {
    if (payload.typ !== JWT_ACCESS_TYP) {
      throw new AppException(AUTH_ERRORS.ACCESS_TOKEN_INVALID);
    }

    const user = await this.usersService.findUserById(payload.sub);

    if (user === null) {
      throw new AppException(AUTH_ERRORS.ACCESS_TOKEN_INVALID);
    }

    this.authService.ensureUserCanLogin(user);

    return {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
