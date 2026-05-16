import { ApiResponse } from '@nestjs/swagger';

export function ApiSuccessResponse(
  status: number,
  type?: new (...args: unknown[]) => unknown,
) {
  return ApiResponse({ status, description: '요청 성공', type });
}
