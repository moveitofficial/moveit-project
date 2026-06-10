import { Logger, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { CS_EVENTS, SOCKET_NAMESPACES } from '@repo/socket-events';
import { Server, Socket } from 'socket.io';

import {
  ADMIN_ACCESS_COOKIE_NAME,
  ADMIN_JWT_ACCESS_TYP,
} from '../../admin/admin-auth/admin-auth.constants';
import { ACCESS_COOKIE_NAME, JWT_ACCESS_TYP } from '../../auth/auth.constants';
import { COMMON_ERRORS } from '../../common/constants/errors';
import { WsExceptionFilter } from '../../common/filters/ws-exception.filter';
import { WsErrorResponse } from '../../common/interfaces/ws-error-response.interface';
import { toWsException } from '../../common/utils/ws-exception.util';
import { JoinRoomDto } from '../common/dto/join-room.dto';
import { MarkReadDto } from '../common/dto/mark-read.dto';
import { parseCookies } from '../common/utils/parse-cookies.util';

import { CsChatService } from './cs-chat.service';
import { SendCSMessageDto } from './dto/send-cs-message.dto';

import type { AdminJwtAccessPayload } from '../../admin/admin-auth/admin-auth.types';
import type { JwtAccessPayload } from '../../auth/auth.types';
import type {
  CsSocket,
  CsSocketData,
} from '../common/interfaces/authenticated-socket.interface';

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
  namespace: SOCKET_NAMESPACES.CS,
  cors: {
    origin: (origin, callback) => {
      const allowed = [process.env.CLIENT_URL, process.env.ADMIN_URL];
      callback(null, allowed.includes(origin));
    },
    credentials: true,
  },
})
export class CsChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  declare server: Server;

  private readonly logger = new Logger(CsChatGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly csChatService: CsChatService,
  ) {}

  handleConnection(socket: Socket) {
    const data = this.#resolvePrincipal(socket);
    if (!data) {
      const response: WsErrorResponse = {
        success: false,
        message: COMMON_ERRORS.UNAUTHORIZED.message,
        error: { code: COMMON_ERRORS.UNAUTHORIZED.code },
      };
      socket.emit('error', response);
      socket.disconnect();
      return;
    }
    (socket as CsSocket).data = data;
    this.logger.log(`CS 연결 (${data.kind}): ${socket.id}`);
  }

  #resolvePrincipal(socket: Socket): CsSocketData | null {
    try {
      const cookies = parseCookies(socket.handshake.headers.cookie);
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
    } catch (error) {
      this.logger.error(`resolvePrincipal error: ${String(error)}`);
      return null;
    }
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`CS 연결 해제: ${socket.id}`);
  }

  @SubscribeMessage(CS_EVENTS.JOIN_ROOM)
  async handleJoinRoom(
    @ConnectedSocket() socket: CsSocket,
    @MessageBody() dto: JoinRoomDto,
  ) {
    await this.csChatService.validateParticipant(dto.roomId, socket.data);
    await socket.join(dto.roomId);
    socket.emit(CS_EVENTS.JOINED_ROOM, { roomId: dto.roomId });
  }

  @SubscribeMessage(CS_EVENTS.SEND_MESSAGE)
  async handleSendMessage(
    @ConnectedSocket() socket: CsSocket,
    @MessageBody() dto: SendCSMessageDto,
  ) {
    const message = await this.csChatService.sendMessage(socket.data, dto);
    this.server.to(dto.roomId).emit(CS_EVENTS.RECEIVE_MESSAGE, message);
  }

  @SubscribeMessage(CS_EVENTS.CLOSE_TICKET)
  async handleCloseTicket(
    @ConnectedSocket() socket: CsSocket,
    @MessageBody() dto: JoinRoomDto,
  ) {
    await this.csChatService.closeTicket(dto.roomId, socket.data);
    this.server
      .to(dto.roomId)
      .emit(CS_EVENTS.TICKET_CLOSED, { roomId: dto.roomId });
  }

  @SubscribeMessage(CS_EVENTS.ASSIGN_ADMIN)
  async handleAssignAdmin(
    @ConnectedSocket() socket: CsSocket,
    @MessageBody() dto: JoinRoomDto,
  ) {
    await this.csChatService.assignAdmin(dto.roomId, socket.data);
    await socket.join(dto.roomId);
    this.server
      .to(dto.roomId)
      .emit(CS_EVENTS.ADMIN_ASSIGNED, { roomId: dto.roomId });
  }

  @SubscribeMessage(CS_EVENTS.MARK_READ)
  async handleMarkRead(
    @ConnectedSocket() socket: CsSocket,
    @MessageBody() dto: MarkReadDto,
  ) {
    await this.csChatService.markRead(dto.roomId, socket.data, dto.messageId);
  }
}
