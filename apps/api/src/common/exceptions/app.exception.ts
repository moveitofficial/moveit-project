import { HttpException } from '@nestjs/common';

interface AppError {
  status: number;
  message: string;
}

export class AppException extends HttpException {
  constructor(error: AppError) {
    super(error.message, error.status);
  }
}
