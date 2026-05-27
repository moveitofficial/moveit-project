import { HttpException } from '@nestjs/common';

interface AppError {
  status: number;
  message: string;
  code?: string;
}

export class AppException extends HttpException {
  readonly code?: string;

  constructor(error: AppError) {
    super(error.message, error.status);
    this.code = error.code;
  }
}
