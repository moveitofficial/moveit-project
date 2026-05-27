import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { COMMON_ERRORS } from '../../../common/constants/errors';
import { AppException } from '../../../common/exceptions/app.exception';

import type { AdminJwtAccessUser } from './admin-jwt-access.strategy';
import type { Request } from 'express';

@Injectable()
export class AdminSuperGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const admin = request.user as AdminJwtAccessUser;

    if (!admin.isSuper) {
      throw new AppException(COMMON_ERRORS.FORBIDDEN);
    }

    return true;
  }
}
