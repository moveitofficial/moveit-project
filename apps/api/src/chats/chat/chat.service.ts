import { Injectable } from '@nestjs/common';

import { CHAT_ERRORS } from '../../common/constants/errors';
import { AppException } from '../../common/exceptions/app.exception';
import { toPaginatedResponse } from '../../common/utils/list-response.util';
import { toWsException } from '../../common/utils/ws-exception.util';

import { ChatRepository } from './chat.repository';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatService {
  constructor(private readonly chatRepository: ChatRepository) {}

  async createRoom(
    clientUserId: string,
    data: {
      expertUserId: string;
      serviceId: string;
      content: string;
      roomId?: string;
      files?: {
        url: string;
        fileName: string;
        fileType: string;
        fileSize: number;
      }[];
    },
  ) {
    const room = await this.chatRepository.createRoom({
      clientUserId,
      ...data,
    });
    return {
      id: room.id,
      currentServiceId: room.currentServiceId,
      clientUser: {
        id: room.clientUser.id,
        profileImageUrl: room.clientUser.profileImageUrl,
        nickname:
          room.clientUser.clientProfile?.nickname ?? room.clientUser.name,
      },
      expertUser: {
        id: room.expertUser.id,
        profileImageUrl: room.expertUser.profileImageUrl,
        businessName: room.expertUser.expertProfile?.businessName ?? null,
      },
      lastMessage: room.lastMessage,
      myLastReadMessageId:
        room.participants.find((p) => p.userId === clientUserId)
          ?.lastReadMessageId ?? null,
      createdAt: room.createdAt,
    };
  }

  async sendFileMessage(
    roomId: string,
    senderId: string,
    attachment: {
      url: string;
      fileName: string;
      fileType: string;
      fileSize: number;
    },
  ) {
    const [participant, room] = await Promise.all([
      this.chatRepository.findRoom(roomId, senderId),
      this.chatRepository.findRoomParticipantIds(roomId),
    ]);
    if (!participant)
      throw new AppException(CHAT_ERRORS.FORBIDDEN_NOT_PARTICIPANT);
    if (!room) throw new AppException(CHAT_ERRORS.ROOM_NOT_FOUND);
    const message = await this.chatRepository.createFileMessage({
      chatRoomId: roomId,
      senderId,
      attachment: {
        fileUrl: attachment.url,
        fileName: attachment.fileName,
        fileType: attachment.fileType,
        fileSize: attachment.fileSize,
      },
    });
    const receiverId =
      room.clientUserId === senderId ? room.expertUserId : room.clientUserId;
    return { message, receiverId };
  }

  async validateParticipant(roomId: string, userId: string) {
    const participant = await this.chatRepository.findRoom(roomId, userId);
    if (!participant)
      throw toWsException(CHAT_ERRORS.FORBIDDEN_NOT_PARTICIPANT);
  }

  async sendMessage(roomId: string, senderId: string, dto: SendMessageDto) {
    await this.validateParticipant(roomId, senderId);
    const [message, room] = await Promise.all([
      this.chatRepository.createMessage({
        chatRoomId: roomId,
        senderId,
        type: dto.type,
        content: dto.content,
        systemType: dto.systemType,
        referenceType: dto.referenceType,
        referenceId: dto.referenceId,
      }),
      this.chatRepository.findRoomParticipantIds(roomId),
    ]);
    if (!room) throw new AppException(CHAT_ERRORS.ROOM_NOT_FOUND);
    const receiverId =
      room.clientUserId === senderId ? room.expertUserId : room.clientUserId;
    return { message, receiverId };
  }

  async markRead(roomId: string, userId: string, messageId: string) {
    await this.validateParticipant(roomId, userId);
    return this.chatRepository.updateLastRead(roomId, userId, messageId);
  }

  async getRooms(userId: string, search?: string, page = 1, limit = 20) {
    const [rooms, totalCount] = await Promise.all([
      this.chatRepository.findAllRooms(userId, search, page, limit),
      this.chatRepository.countRooms(userId, search),
    ]);
    const items = rooms.map((room) => ({
      id: room.id,
      currentServiceId: room.currentServiceId,
      clientUser: {
        id: room.clientUser.id,
        profileImageUrl: room.clientUser.profileImageUrl,
        nickname:
          room.clientUser.clientProfile?.nickname ?? room.clientUser.name,
      },
      expertUser: {
        id: room.expertUser.id,
        profileImageUrl: room.expertUser.profileImageUrl,
        businessName: room.expertUser.expertProfile?.businessName ?? null,
      },
      lastMessage: room.lastMessage,
      myLastReadMessageId:
        room.participants.find((p) => p.userId === userId)?.lastReadMessageId ??
        null,
      createdAt: room.createdAt,
    }));
    return toPaginatedResponse(items, { page, pageSize: limit, totalCount });
  }

  async getMessages(
    roomId: string,
    userId: string,
    cursor?: string,
    limit = 30,
  ) {
    const participant = await this.chatRepository.findRoom(roomId, userId);
    if (!participant)
      throw new AppException(CHAT_ERRORS.FORBIDDEN_NOT_PARTICIPANT);
    const messages = await this.chatRepository.findMessages(
      roomId,
      cursor,
      limit,
    );
    const nextCursor =
      messages.length === limit ? (messages.at(-1)?.id ?? null) : null;
    return {
      items: messages.toReversed(),
      nextCursor,
    };
  }

  async getNotifications(userId: string) {
    const participants = await this.chatRepository.findUnreadRooms(userId);
    return participants.map((p) => ({
      id: p.chatRoom.id,
      currentServiceId: p.chatRoom.currentServiceId,
      clientUser: {
        id: p.chatRoom.clientUser.id,
        profileImageUrl: p.chatRoom.clientUser.profileImageUrl,
        nickname:
          p.chatRoom.clientUser.clientProfile?.nickname ??
          p.chatRoom.clientUser.name,
      },
      expertUser: {
        id: p.chatRoom.expertUser.id,
        profileImageUrl: p.chatRoom.expertUser.profileImageUrl,
        businessName: p.chatRoom.expertUser.expertProfile?.businessName ?? null,
      },
      lastMessage: p.chatRoom.lastMessage,
    }));
  }

  async dismissNotification(userId: string, roomId: string) {
    const participant = await this.chatRepository.findRoom(roomId, userId);
    if (!participant)
      throw new AppException(CHAT_ERRORS.FORBIDDEN_NOT_PARTICIPANT);
    await this.chatRepository.updateDismissedMessage(roomId, userId);
  }

  async dismissAllNotifications(userId: string) {
    await this.chatRepository.updateAllDismissedMessages(userId);
  }
}
