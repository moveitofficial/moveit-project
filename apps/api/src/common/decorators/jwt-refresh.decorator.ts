import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { JwtRefreshGuard } from '../../auth/jwt/jwt-refresh.guard';
import { AUTH_ERRORS } from '../constants/errors';
import { errorResponseExample } from '../swagger/error-response-example';
import { ErrorResponseDto } from '../swagger/error-response.dto';

export function JwtRefresh() {
  const allErrors = [
    AUTH_ERRORS.TOKEN_EXPIRED,
    AUTH_ERRORS.REFRESH_TOKEN_INVALID,
  ];

  return applyDecorators(
    UseGuards(JwtRefreshGuard),
    ApiCookieAuth('cookieAuth'),
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
