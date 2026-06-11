import { Logger, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { SOCKET_NAMESPACES } from '@repo/socket-events';
import { Server, Socket } from 'socket.io';

import { ACCESS_COOKIE_NAME, JWT_ACCESS_TYP } from '../auth/auth.constants';
import { parseCookies } from '../chats/common/utils/parse-cookies.util';
import { COMMON_ERRORS } from '../common/constants/errors';
import { WsExceptionFilter } from '../common/filters/ws-exception.filter';
import { toWsException } from '../common/utils/ws-exception.util';

import type { JwtAccessPayload } from '../auth/auth.types';
import type { WsErrorResponse } from '../common/interfaces/ws-error-response.interface';

@UsePipes(
  new ValidationPipe({
    whitelist: true,
    exceptionFactory: (_errors) =>
      toWsException({
        message: COMMON_ERRORS.VALIDATION_ERROR.message,
        code: COMMON_ERRORS.VALIDATION_ERROR.code,
      }),
  }),
)
@UseFilters(WsExceptionFilter)
@WebSocketGateway({
  namespace: SOCKET_NAMESPACES.NOTIFICATIONS,
  cors: {
    origin: (origin, callback) => {
      callback(null, origin === process.env.CLIENT_URL);
    },
    credentials: true,
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  declare server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  constructor(private readonly jwtService: JwtService) {}

  handleConnection(socket: Socket) {
    const payload = this.#resolvePrincipal(socket);
    if (!payload) {
      const response: WsErrorResponse = {
        success: false,
        message: COMMON_ERRORS.UNAUTHORIZED.message,
        error: { code: COMMON_ERRORS.UNAUTHORIZED.code },
      };
      socket.emit('error', response);
      socket.disconnect();
      return;
    }
    void socket.join(`user-${payload.sub}`);
    this.logger.log(`연결: ${socket.id} (userId: ${payload.sub})`);
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`연결 해제: ${socket.id}`);
  }

  emitNewNotification(userId: string): void {
    this.server.to(`user-${userId}`).emit('newNotification');
  }

  #resolvePrincipal(socket: Socket): JwtAccessPayload | null {
    try {
      const token = parseCookies(socket.handshake.headers.cookie)[
        ACCESS_COOKIE_NAME
      ];
      if (!token) return null;
      const payload = this.jwtService.verify<JwtAccessPayload>(token);
      return payload.typ === JWT_ACCESS_TYP ? payload : null;
    } catch (error) {
      this.logger.error(`resolvePrincipal error: ${String(error)}`);
      return null;
    }
  }
}
