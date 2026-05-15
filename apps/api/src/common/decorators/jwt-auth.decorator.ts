import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiUnauthorizedResponse } from '@nestjs/swagger';

import { JwtAccessGuard } from '../../auth/jwt/jwt-access.guard';
import { AUTH_ERRORS } from '../constants/errors';
import { ErrorResponseDto } from '../dto/error-response.dto';
import { errorResponseExample } from '../swagger/error-response-example';

interface ErrorConstant {
  status: number;
  message: string;
}

export function JwtAuth(...additionalErrors: ErrorConstant[]) {
  const allErrors = [
    AUTH_ERRORS.TOKEN_EXPIRED,
    AUTH_ERRORS.ACCESS_TOKEN_INVALID,
    ...additionalErrors,
  ];

  return applyDecorators(
    UseGuards(JwtAccessGuard),
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
