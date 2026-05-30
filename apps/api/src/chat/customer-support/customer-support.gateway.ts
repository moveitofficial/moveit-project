import { Logger, UseFilters } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import {
  ADMIN_ACCESS_COOKIE_NAME,
  ADMIN_JWT_ACCESS_TYP,
} from '../../admin/admin-auth/admin-auth.constants';
import { ACCESS_COOKIE_NAME, JWT_ACCESS_TYP } from '../../auth/auth.constants';
import { WsExceptionFilter } from '../../common/filters/ws-exception.filter';
import { parseCookies } from '../common/utils/parse-cookies.util';

import type { AdminJwtAccessPayload } from '../../admin/admin-auth/admin-auth.types';
import type { JwtAccessPayload } from '../../auth/auth.types';
import type {
  CsSocket,
  CsSocketData,
} from '../common/interfaces/authenticated-socket.interface';

@UseFilters(WsExceptionFilter)
@WebSocketGateway({
  namespace: 'cs',
  cors: {
    origin: (origin, callback) => {
      const allowed = [process.env.CLIENT_URL, process.env.ADMIN_URL];
      callback(null, allowed.includes(origin));
    },
    credentials: true,
  },
})
export class CustomerSupportGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  declare server: Server;

  private readonly logger = new Logger(CustomerSupportGateway.name);

  constructor(private readonly jwtService: JwtService) {}

  handleConnection(client: Socket) {
    const data = this.#resolvePrincipal(client);
    if (!data) {
      client.emit('error', {
        success: false,
        message: '인증에 실패했습니다.',
        error: { code: 'UNAUTHORIZED' },
      });
      client.disconnect();
      return;
    }
    (client as CsSocket).data = data;
    this.logger.log(`CS 연결 (${data.kind}): ${client.id}`);
  }

  #resolvePrincipal(client: Socket): CsSocketData | null {
    try {
      const cookies = parseCookies(client.handshake.headers.cookie);
      const userToken = cookies[ACCESS_COOKIE_NAME];
      const adminToken = cookies[ADMIN_ACCESS_COOKIE_NAME];

      if (userToken) {
        const payload = this.jwtService.verify<JwtAccessPayload>(userToken);
        return payload.typ === JWT_ACCESS_TYP
          ? { kind: 'user', userId: payload.sub }
          : null;
      }
      if (adminToken) {
        const payload =
          this.jwtService.verify<AdminJwtAccessPayload>(adminToken);
        return payload.typ === ADMIN_JWT_ACCESS_TYP
          ? { kind: 'admin', adminId: payload.sub }
          : null;
      }
      return null;
    } catch {
      return null;
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`CS 연결 해제: ${client.id}`);
  }
}
