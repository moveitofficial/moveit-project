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
import { CHAT_EVENTS, SOCKET_NAMESPACES } from '@repo/socket-events';
import { Server, Socket } from 'socket.io';

import { ACCESS_COOKIE_NAME, JWT_ACCESS_TYP } from '../../auth/auth.constants';
import { COMMON_ERRORS } from '../../common/constants/errors';
import { WsExceptionFilter } from '../../common/filters/ws-exception.filter';
import { toWsException } from '../../common/utils/ws-exception.util';
import { JoinRoomDto } from '../common/dto/join-room.dto';
import { MarkReadDto } from '../common/dto/mark-read.dto';
import { parseCookies } from '../common/utils/parse-cookies.util';

import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';

import type { JwtAccessPayload } from '../../auth/auth.types';
import type { WsErrorResponse } from '../../common/interfaces/ws-error-response.interface';
import type { ChatSocket } from '../common/interfaces/authenticated-socket.interface';
import type { SystemMessageRole } from '@repo/socket-events';

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
  namespace: SOCKET_NAMESPACES.CHAT,
  cors: {
    origin: (origin, callback) => {
      callback(null, origin === process.env.CLIENT_URL);
    },
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  declare server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly chatService: ChatService,
  ) {}

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
    (socket as ChatSocket).data = {
      userId: payload.sub,
      role: payload.role,
    };
    void socket.join(`user-${payload.sub}`);
    this.logger.log(`연결: ${socket.id} (userId: ${payload.sub})`);
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

  handleDisconnect(socket: Socket) {
    this.logger.log(`연결 해제: ${socket.id}`);
  }

  broadcastMessage(roomId: string, message: unknown) {
    this.server.to(roomId).emit(CHAT_EVENTS.RECEIVE_MESSAGE, message);
  }

  broadcastSystemMessage(
    roomId: string,
    clientUserId: string,
    expertUserId: string,
    message: unknown,
    recipientRoles?: SystemMessageRole[],
  ) {
    if (!recipientRoles) {
      this.server.to(roomId).emit(CHAT_EVENTS.RECEIVE_MESSAGE, message);
      return;
    }
    if (recipientRoles.includes('CLIENT')) {
      this.server
        .to(`user-${clientUserId}`)
        .emit(CHAT_EVENTS.RECEIVE_MESSAGE, message);
    }
    if (recipientRoles.includes('EXPERT')) {
      this.server
        .to(`user-${expertUserId}`)
        .emit(CHAT_EVENTS.RECEIVE_MESSAGE, message);
    }
  }

  broadcastNotification(receiverId: string, message: unknown) {
    this.server
      .to(`user-${receiverId}`)
      .emit(CHAT_EVENTS.CHAT_NOTIFICATION, message);
  }

  @SubscribeMessage(CHAT_EVENTS.JOIN_ROOM)
  async handleJoinRoom(
    @ConnectedSocket() socket: ChatSocket,
    @MessageBody() dto: JoinRoomDto,
  ) {
    await this.chatService.validateParticipant(dto.roomId, socket.data.userId);
    await socket.join(dto.roomId);
    socket.emit(CHAT_EVENTS.JOINED_ROOM, { roomId: dto.roomId });
  }

  @SubscribeMessage(CHAT_EVENTS.SEND_MESSAGE)
  async handleSendMessage(
    @ConnectedSocket() socket: ChatSocket,
    @MessageBody() dto: SendMessageDto,
  ) {
    const { message, receiverId } = await this.chatService.sendMessage(
      dto.roomId,
      socket.data.userId,
      dto,
    );
    this.server.to(dto.roomId).emit(CHAT_EVENTS.RECEIVE_MESSAGE, message);
    this.server
      .to(`user-${receiverId}`)
      .emit(CHAT_EVENTS.CHAT_NOTIFICATION, message);
  }

  @SubscribeMessage(CHAT_EVENTS.MARK_READ)
  async handleMarkRead(
    @ConnectedSocket() socket: ChatSocket,
    @MessageBody() dto: MarkReadDto,
  ) {
    await this.chatService.markRead(
      dto.roomId,
      socket.data.userId,
      dto.messageId,
    );
  }
}
