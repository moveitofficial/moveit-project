import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { JwtAccessGuard } from '../../auth/jwt/jwt-access.guard';
import { AUTH_ERRORS, COMMON_ERRORS, USER_ERRORS } from '../constants/errors';
import { RolesGuard } from '../guards/roles.guard';
import { errorResponseExample } from '../swagger/error-response-example';
import { ErrorResponseDto } from '../swagger/error-response.dto';

import { ApiErrorResponse } from './api-error-response.decorator';

import type { Role } from '@prisma/client';

interface ErrorConstant {
  status: number;
  message: string;
}

export const ROLES_KEY = 'roles';

export function JwtAuth(...additionalErrors: ErrorConstant[]) {
  const allErrors = [
    AUTH_ERRORS.TOKEN_EXPIRED,
    AUTH_ERRORS.ACCESS_TOKEN_INVALID,
    ...additionalErrors,
  ];

  return applyDecorators(
    UseGuards(JwtAccessGuard),
    ApiCookieAuth('cookieAuth'),
    ApiErrorResponse(COMMON_ERRORS.BLOCKED, USER_ERRORS.DELETED),
    ApiUnauthorizedResponse({
      type: ErrorResponseDto,
      examples: Object.fromEntries(
        allErrors.map((err, i) => [
          String(i),
          { summary: err.message, value: errorResponseExample(err) },
        ]),
      ),
    }),
  );
}

export function RoleAuth(role: Role, ...additionalErrors: ErrorConstant[]) {
  const allErrors = [
    AUTH_ERRORS.TOKEN_EXPIRED,
    AUTH_ERRORS.ACCESS_TOKEN_INVALID,
    ...additionalErrors,
  ];

  return applyDecorators(
    SetMetadata(ROLES_KEY, [role]),
    UseGuards(JwtAccessGuard, RolesGuard),
    ApiCookieAuth('cookieAuth'),
    ApiErrorResponse(
      COMMON_ERRORS.BLOCKED,
      USER_ERRORS.DELETED,
      COMMON_ERRORS.FORBIDDEN,
    ),
    ApiUnauthorizedResponse({
      type: ErrorResponseDto,
      examples: Object.fromEntries(
        allErrors.map((err, i) => [
          String(i),
          { summary: err.message, value: errorResponseExample(err) },
        ]),
      ),
    }),
  );
}
