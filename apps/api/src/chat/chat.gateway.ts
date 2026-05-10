import { Logger, UseFilters } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { WsExceptionFilter } from '../common/filters/ws-exceptions.filter';

@UseFilters(WsExceptionFilter)
@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: (origin, callback) => {
      const allowed = [process.env.CLIENT_URL, process.env.ADMIN_URL];
      callback(null, allowed.includes(origin));
    },
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  declare server: Server;

  private readonly logger = new Logger('ChatGateway');

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    await client.join(roomId);
    client.emit('joinedRoom', { roomId });
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    await client.leave(roomId);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() payload: { roomId: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    // TODO: 메세지 저장 로직 (MessageService 주입 후 구현)
    this.server.to(payload.roomId).emit('receiveMessage', {
      senderId: client.id,
      message: payload.message,
      timestamp: new Date().toISOString(),
    });
  }
}
