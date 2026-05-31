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
import { Role } from '@prisma/client';
import { CHAT_EVENTS, SOCKET_NAMESPACES } from '@repo/socket-events';
import { Server, Socket } from 'socket.io';

import { ACCESS_COOKIE_NAME, JWT_ACCESS_TYP } from '../../auth/auth.constants';
import { CHAT_ERRORS, COMMON_ERRORS } from '../../common/constants/errors';
import { WsExceptionFilter } from '../../common/filters/ws-exception.filter';
import { toWsException } from '../../common/utils/ws-exception.util';
import { parseCookies } from '../common/utils/parse-cookies.util';

import { ConsultationChatService } from './consultation-chat.service';
import { GetOrCreateRoomDto } from './dto/get-or-create-room.dto';
import { JoinRoomDto } from './dto/join-room.dto';
import { MarkReadDto } from './dto/mark-read.dto';
import { SendMessageDto } from './dto/send-message.dto';

import type { JwtAccessPayload } from '../../auth/auth.types';
import type { WsErrorResponse } from '../../common/interfaces/ws-error-response.interface';
import type { ConsultationSocket } from '../common/interfaces/authenticated-socket.interface';

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
  namespace: SOCKET_NAMESPACES.CONSULTATION,
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

  constructor(
    private readonly jwtService: JwtService,
    private readonly consultationChatService: ConsultationChatService,
  ) {}

  handleConnection(socket: Socket) {
    const payload = this.#resolvePayload(socket);
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
    (socket as ConsultationSocket).data = {
      userId: payload.sub,
      role: payload.role,
    };
    this.logger.log(`연결: ${socket.id} (userId: ${payload.sub})`);
  }

  #resolvePayload(socket: Socket): JwtAccessPayload | null {
    try {
      const token = parseCookies(socket.handshake.headers.cookie)[
        ACCESS_COOKIE_NAME
      ];
      if (!token) return null;
      const payload = this.jwtService.verify<JwtAccessPayload>(token);
      return payload.typ === JWT_ACCESS_TYP ? payload : null;
    } catch {
      return null;
    }
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`연결 해제: ${socket.id}`);
  }

  @SubscribeMessage(CHAT_EVENTS.GET_OR_CREATE_ROOM)
  async handleGetOrCreateRoom(
    @ConnectedSocket() socket: ConsultationSocket,
    @MessageBody() dto: GetOrCreateRoomDto,
  ) {
    if (socket.data.role !== Role.CLIENT) {
      throw toWsException(CHAT_ERRORS.FORBIDDEN_NOT_CLIENT);
    }
    const room = await this.consultationChatService.getOrCreateRoom(
      socket.data.userId,
      dto.expertUserId,
      dto.serviceId,
    );
    await socket.join(room.id);
    socket.emit(CHAT_EVENTS.ROOM_READY, { roomId: room.id });
  }

  @SubscribeMessage(CHAT_EVENTS.JOIN_ROOM)
  async handleJoinRoom(
    @ConnectedSocket() socket: ConsultationSocket,
    @MessageBody() dto: JoinRoomDto,
  ) {
    await this.consultationChatService.validateParticipant(
      dto.roomId,
      socket.data.userId,
    );
    await socket.join(dto.roomId);
    socket.emit(CHAT_EVENTS.JOINED_ROOM, { roomId: dto.roomId });
  }

  @SubscribeMessage(CHAT_EVENTS.SEND_MESSAGE)
  async handleSendMessage(
    @ConnectedSocket() socket: ConsultationSocket,
    @MessageBody() dto: SendMessageDto,
  ) {
    const message = await this.consultationChatService.sendMessage(
      dto.chatRoomId,
      socket.data.userId,
      dto,
    );
    this.server.to(dto.chatRoomId).emit(CHAT_EVENTS.RECEIVE_MESSAGE, message);
  }

  @SubscribeMessage(CHAT_EVENTS.MARK_READ)
  async handleMarkRead(
    @ConnectedSocket() socket: ConsultationSocket,
    @MessageBody() dto: MarkReadDto,
  ) {
    await this.consultationChatService.markRead(
      dto.roomId,
      socket.data.userId,
      dto.messageId,
    );
  }
}
