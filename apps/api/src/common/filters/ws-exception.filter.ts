import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch()
export class WsExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<Socket>();

    const isWsException = exception instanceof WsException;
    const error = isWsException ? exception.getError() : null;
    const message = isWsException
      ? typeof error === 'string'
        ? error
        : JSON.stringify(error)
      : 'Internal server error';

    client.emit('error', {
      success: false,
      message,
      error: {
        code: isWsException ? 'WS_ERROR' : 'INTERNAL_SERVER_ERROR',
        details: {},
      },
    });
  }
}
