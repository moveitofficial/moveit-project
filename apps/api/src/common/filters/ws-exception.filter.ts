import { ArgumentsHost, Catch, Logger } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { COMMON_ERRORS } from '../constants/errors';
import { WsErrorResponse } from '../interfaces/ws-error-response.interface';

interface WsErrorPayload {
  message: string;
  code: string;
}

function isWsErrorPayload(value: unknown): value is WsErrorPayload {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.message === 'string' && typeof v.code === 'string';
}

@Catch()
export class WsExceptionFilter extends BaseWsExceptionFilter {
  private readonly logger = new Logger(WsExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<Socket>();

    if (!(exception instanceof WsException)) {
      this.logger.error(exception);
      const response: WsErrorResponse = {
        success: false,
        message: COMMON_ERRORS.INTERNAL_SERVER_ERROR.message,
        error: { code: COMMON_ERRORS.INTERNAL_SERVER_ERROR.code },
      };
      client.emit('error', response);
      return;
    }

    const error = exception.getError();
    let response: WsErrorResponse;

    if (isWsErrorPayload(error)) {
      response = {
        success: false,
        message: error.message,
        error: { code: error.code },
      };
    } else {
      const message =
        typeof error === 'string'
          ? error
          : COMMON_ERRORS.INTERNAL_SERVER_ERROR.message;
      response = { success: false, message, error: { code: 'WS_ERROR' } };
    }

    client.emit('error', response);
  }
}
