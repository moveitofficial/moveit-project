import { HttpException } from '@nestjs/common';

interface AppError {
  status: number;
  message: string;
  code: string;
}

export class AppException extends HttpException {
  public readonly code: string;
  public readonly details?: Record<string, unknown>;

  constructor(error: AppError, details?: Record<string, unknown>) {
    super(error.message, error.status);
    this.code = error.code;
    this.details = details;
  }
}
