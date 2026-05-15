import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // AppException 포함 모든 HttpException (AppException extends HttpException)
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();

      // message가 문자열 배열일 때 (ValidationPipe)
      if (
        typeof res === 'object' &&
        'message' in res &&
        Array.isArray(res.message)
      ) {
        response.status(status).json({
          success: false,
          message: '입력값을 확인해주세요.',
          error: { code: status },
        });
        return;
      }

      // 그 외 HttpException
      response.status(status).json({
        success: false,
        message: exception.message,
        error: { code: status },
      });
      return;
    }

    // 예상치 못한 에러
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Internal server error',
      error: { code: HttpStatus.INTERNAL_SERVER_ERROR },
    });
  }
}
