import { Injectable } from '@nestjs/common';
import { CsChatStatus, SenderType } from '@prisma/client';

import { CS_CHAT_ERRORS } from '../../common/constants/errors';
import { AppException } from '../../common/exceptions/app.exception';
import { toPaginatedResponse } from '../../common/utils/list-response.util';
import { toWsException } from '../../common/utils/ws-exception.util';

import { CsChatRepository } from './cs-chat.repository';
import { SendCSMessageDto } from './dto/send-cs-message.dto';

import type { CsSocketData } from '../common/interfaces/authenticated-socket.interface';

@Injectable()
export class CsChatService {
  constructor(private readonly csChatRepository: CsChatRepository) {}

  async validateParticipant(roomId: string, socketData: CsSocketData) {
    const room = await this.csChatRepository.findRoom(roomId);
    if (!room) throw toWsException(CS_CHAT_ERRORS.ROOM_NOT_FOUND);

    const isParticipant =
      socketData.kind === 'user'
        ? room.userId === socketData.userId
        : room.assignedAdminId === socketData.adminId;

    if (!isParticipant) throw toWsException(CS_CHAT_ERRORS.FORBIDDEN);
    return room;
  }

  async sendMessage(socketData: CsSocketData, dto: SendCSMessageDto) {
    await this.validateParticipant(dto.roomId, socketData);

    const senderFields =
      socketData.kind === 'user'
        ? { senderType: SenderType.USER, senderUserId: socketData.userId }
        : { senderType: SenderType.ADMIN, senderAdminId: socketData.adminId };

    return this.csChatRepository.createMessage({
      chatRoomId: dto.roomId,
      content: dto.content,
      type: dto.type,
      ...senderFields,
    });
  }

  async markRead(roomId: string, socketData: CsSocketData, messageId: string) {
    await this.validateParticipant(roomId, socketData);
    const senderType =
      socketData.kind === 'user' ? SenderType.USER : SenderType.ADMIN;
    await this.csChatRepository.updateLastRead(roomId, senderType, messageId);
  }

  async closeTicket(roomId: string, socketData: CsSocketData) {
    if (socketData.kind !== 'admin')
      throw toWsException(CS_CHAT_ERRORS.FORBIDDEN_NOT_ADMIN);
    const room = await this.csChatRepository.findRoom(roomId);
    if (!room) throw toWsException(CS_CHAT_ERRORS.ROOM_NOT_FOUND);
    if (room.status === CsChatStatus.CLOSED)
      throw toWsException(CS_CHAT_ERRORS.ALREADY_CLOSED);
    await this.csChatRepository.closeChatRoom(roomId);
  }

  async assignAdmin(roomId: string, socketData: CsSocketData) {
    if (socketData.kind !== 'admin')
      throw toWsException(CS_CHAT_ERRORS.FORBIDDEN_NOT_ADMIN);
    const room = await this.csChatRepository.findRoom(roomId);
    if (!room) throw toWsException(CS_CHAT_ERRORS.ROOM_NOT_FOUND);
    if (room.assignedAdminId)
      throw toWsException(CS_CHAT_ERRORS.ALREADY_ASSIGNED);
    await this.csChatRepository.assignAdmin(roomId, socketData.adminId);
  }

  async sendFileMessage(
    roomId: string,
    sender: {
      senderType: SenderType;
      senderUserId?: string;
      senderAdminId?: string;
    },
    attachment: {
      url: string;
      fileName: string;
      fileType: string;
      fileSize: number;
    },
  ) {
    const room = await this.csChatRepository.findRoom(roomId);
    if (!room) throw new AppException(CS_CHAT_ERRORS.ROOM_NOT_FOUND);
    if (
      sender.senderType === SenderType.USER &&
      room.userId !== sender.senderUserId
    )
      throw new AppException(CS_CHAT_ERRORS.FORBIDDEN);
    return this.csChatRepository.createFileMessage({
      chatRoomId: roomId,
      senderType: sender.senderType,
      senderUserId: sender.senderUserId,
      senderAdminId: sender.senderAdminId,
      attachment: {
        fileUrl: attachment.url,
        fileName: attachment.fileName,
        fileType: attachment.fileType,
        fileSize: attachment.fileSize,
      },
    });
  }

  async createRoom(userId: string, content: string) {
    const room = await this.csChatRepository.createRoomWithFirstMessage(
      userId,
      content,
    );
    return {
      id: room.id,
      status: room.status,
      lastMessage: room.lastMessage,
      myLastReadMessageId: room.userLastReadMessageId,
      createdAt: room.createdAt,
    };
  }

  async getRoomsByUser(userId: string, page = 1, limit = 20) {
    const [rooms, totalCount] = await Promise.all([
      this.csChatRepository.findAllRoomsByUser(userId, page, limit),
      this.csChatRepository.countRoomsByUser(userId),
    ]);
    const items = rooms.map((room) => ({
      id: room.id,
      status: room.status,
      lastMessage: room.lastMessage,
      myLastReadMessageId: room.userLastReadMessageId,
      createdAt: room.createdAt,
    }));
    return toPaginatedResponse(items, { page, pageSize: limit, totalCount });
  }

  async getRoomsForAdmin(search?: string, page = 1, limit = 20) {
    const [rooms, totalCount] = await Promise.all([
      this.csChatRepository.findAllRoomsForAdmin(search, page, limit),
      this.csChatRepository.countRoomsForAdmin(search),
    ]);
    const items = rooms.map((room) => ({
      id: room.id,
      status: room.status,
      user: {
        id: room.user.id,
        profileImageUrl: room.user.profileImageUrl,
        nickname:
          room.user.clientProfile?.nickname ??
          room.user.name ??
          room.user.expertProfile?.businessName ??
          null,
      },
      assignedAdmin: room.assignedAdmin,
      lastMessage: room.lastMessage,
      myLastReadMessageId: room.adminLastReadMessageId,
      createdAt: room.createdAt,
    }));
    return toPaginatedResponse(items, { page, pageSize: limit, totalCount });
  }

  async getMessagesByUser(
    roomId: string,
    userId: string,
    cursor?: string,
    limit = 30,
  ) {
    const room = await this.csChatRepository.findRoom(roomId);
    if (room?.userId !== userId)
      throw new AppException(CS_CHAT_ERRORS.FORBIDDEN);
    const messages = await this.csChatRepository.findMessages(
      roomId,
      cursor,
      limit,
    );
    const nextCursor =
      messages.length === limit ? (messages.at(-1)?.id ?? null) : null;
    return { items: messages.toReversed(), nextCursor };
  }

  async getMessagesForAdmin(roomId: string, cursor?: string, limit = 30) {
    const room = await this.csChatRepository.findRoom(roomId);
    if (!room) throw new AppException(CS_CHAT_ERRORS.ROOM_NOT_FOUND);
    const messages = await this.csChatRepository.findMessages(
      roomId,
      cursor,
      limit,
    );
    const nextCursor =
      messages.length === limit ? (messages.at(-1)?.id ?? null) : null;
    return { items: messages.toReversed(), nextCursor };
  }
}
