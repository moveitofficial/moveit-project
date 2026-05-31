import { Logger, UseFilters } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { ACCESS_COOKIE_NAME, JWT_ACCESS_TYP } from '../../auth/auth.constants';
import { WsExceptionFilter } from '../../common/filters/ws-exception.filter';
import { parseCookies } from '../common/utils/parse-cookies.util';

import type { JwtAccessPayload } from '../../auth/auth.types';
import type { ConsultationSocket } from '../common/interfaces/authenticated-socket.interface';

@UseFilters(WsExceptionFilter)
@WebSocketGateway({
  namespace: 'consultation',
  cors: {
    origin: (origin, callback) => {
      callback(null, origin === process.env.CLIENT_URL);
    },
    credentials: true,
  },
})
export class ConsultationChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  declare server: Server;

  private readonly logger = new Logger(ConsultationChatGateway.name);

  constructor(private readonly jwtService: JwtService) {}

  handleConnection(client: Socket) {
    const payload = this.#resolvePayload(client);
    if (!payload) {
      client.emit('error', {
        success: false,
        message: '인증에 실패했습니다.',
        error: { code: 'UNAUTHORIZED' },
      });
      client.disconnect();
      return;
    }
    (client as ConsultationSocket).data = {
      userId: payload.sub,
      role: payload.role,
    };
    this.logger.log(`연결: ${client.id} (userId: ${payload.sub})`);
  }

  #resolvePayload(client: Socket): JwtAccessPayload | null {
    try {
      const token = parseCookies(client.handshake.headers.cookie)[
        ACCESS_COOKIE_NAME
      ];
      if (!token) return null;
      const payload = this.jwtService.verify<JwtAccessPayload>(token);
      return payload.typ === JWT_ACCESS_TYP ? payload : null;
    } catch {
      return null;
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`연결 해제: ${client.id}`);
  }
}
