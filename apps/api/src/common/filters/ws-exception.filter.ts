import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

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
  catch(exception: unknown, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<Socket>();

    if (!(exception instanceof WsException)) {
      client.emit('error', {
        success: false,
        message: '서버 오류가 발생했습니다.',
        error: { code: 'INTERNAL_SERVER_ERROR' },
      });
      return;
    }

    const error = exception.getError();

    if (isWsErrorPayload(error)) {
      client.emit('error', {
        success: false,
        message: error.message,
        error: { code: error.code },
      });
    } else {
      const message =
        typeof error === 'string' ? error : '서버 오류가 발생했습니다.';
      client.emit('error', {
        success: false,
        message,
        error: { code: 'WS_ERROR' },
      });
    }
  }
}
