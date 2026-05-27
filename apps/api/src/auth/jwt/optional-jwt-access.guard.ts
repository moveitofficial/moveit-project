import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

import { AUTH_ERRORS } from '../../common/constants/errors';
import { AppException } from '../../common/exceptions/app.exception';

import type { JwtAccessUser } from './jwt-access.strategy';

@Injectable()
export class OptionalJwtAccessGuard extends AuthGuard('jwt-access') {
  handleRequest<TUser = JwtAccessUser>(
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

    if (info instanceof JsonWebTokenError) {
      throw new AppException(AUTH_ERRORS.ACCESS_TOKEN_INVALID);
    }

    if (user === false) {
      return undefined as TUser;
    }

    return user;
  }
}
