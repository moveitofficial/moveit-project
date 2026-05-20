import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';

import { AUTH_ERRORS } from '../../common/constants/errors';
import { AppException } from '../../common/exceptions/app.exception';

import type { JwtRefreshUser } from './jwt-refresh.strategy';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  handleRequest<TUser = JwtRefreshUser>(
    err: Error | null,
    user: TUser | false,
    info: Error | undefined,
  ): TUser {
    if (err instanceof AppException) {
      throw err;
    }

    if (info instanceof TokenExpiredError) {
      throw new AppException(AUTH_ERRORS.TOKEN_EXPIRED);
    }

    if (err !== null || user === false) {
      throw new AppException(AUTH_ERRORS.REFRESH_TOKEN_INVALID);
    }

    return user;
  }
}
