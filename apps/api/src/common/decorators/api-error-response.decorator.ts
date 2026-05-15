import { ApiResponse } from '@nestjs/swagger';

import { errorResponseExample } from '../swagger/error-response-example';
import { ErrorResponseDto } from '../swagger/error-response.dto';

interface ErrorConstant {
  status: number;
  message: string;
}

export function ApiErrorResponse(...errs: [ErrorConstant, ...ErrorConstant[]]) {
  if (errs.length === 1) {
    return ApiResponse({
      status: errs[0].status,
      type: ErrorResponseDto,
      description: errs[0].message,
      example: errorResponseExample(errs[0]),
    });
  }

  return ApiResponse({
    status: errs[0].status,
    type: ErrorResponseDto,
    examples: Object.fromEntries(
      errs.map((err, i) => [
        String(i),
        { summary: err.message, value: errorResponseExample(err) },
      ]),
    ),
  });
}
