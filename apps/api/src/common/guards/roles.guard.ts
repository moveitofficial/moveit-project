import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { COMMON_ERRORS } from '../constants/errors';
import { ROLES_KEY } from '../decorators/jwt-auth.decorator';
import { AppException } from '../exceptions/app.exception';

import type { JwtAccessUser } from '../../auth/jwt/jwt-access.strategy';
import type { Role } from '@prisma/client';
import type { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Role[] | undefined>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!roles) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as JwtAccessUser;
    if (!roles.includes(user.role)) {
      throw new AppException(COMMON_ERRORS.FORBIDDEN);
    }
    return true;
  }
}
