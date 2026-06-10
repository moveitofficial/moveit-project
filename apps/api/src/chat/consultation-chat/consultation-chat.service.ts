import { Injectable } from '@nestjs/common';

import { CHAT_ERRORS } from '../../common/constants/errors';
import { AppException } from '../../common/exceptions/app.exception';
import { toPaginatedResponse } from '../../common/utils/list-response.util';
import { toWsException } from '../../common/utils/ws-exception.util';

import { ConsultationChatRepository } from './consultation-chat.repository';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ConsultationChatService {
  constructor(
    private readonly consultationChatRepository: ConsultationChatRepository,
  ) {}

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
    const room = await this.consultationChatRepository.createRoom({
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
    const participant = await this.consultationChatRepository.findRoom(
      roomId,
      senderId,
    );
    if (!participant)
      throw new AppException(CHAT_ERRORS.FORBIDDEN_NOT_PARTICIPANT);
    return this.consultationChatRepository.createFileMessage({
      chatRoomId: roomId,
      senderId,
      attachment: {
        fileUrl: attachment.url,
        fileName: attachment.fileName,
        fileType: attachment.fileType,
        fileSize: attachment.fileSize,
      },
    });
  }

  async validateParticipant(roomId: string, userId: string) {
    const participant = await this.consultationChatRepository.findRoom(
      roomId,
      userId,
    );
    if (!participant)
      throw toWsException(CHAT_ERRORS.FORBIDDEN_NOT_PARTICIPANT);
  }

  async sendMessage(roomId: string, senderId: string, dto: SendMessageDto) {
    await this.validateParticipant(roomId, senderId);
    return this.consultationChatRepository.createMessage({
      chatRoomId: roomId,
      senderId,
      type: dto.type,
      content: dto.content,
      systemType: dto.systemType,
      referenceType: dto.referenceType,
      referenceId: dto.referenceId,
    });
  }

  async markRead(roomId: string, userId: string, messageId: string) {
    await this.validateParticipant(roomId, userId);
    return this.consultationChatRepository.updateLastRead(
      roomId,
      userId,
      messageId,
    );
  }

  async getRooms(userId: string, search?: string, page = 1, limit = 20) {
    const [rooms, totalCount] = await Promise.all([
      this.consultationChatRepository.findAllRooms(userId, search, page, limit),
      this.consultationChatRepository.countRooms(userId, search),
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
    const participant = await this.consultationChatRepository.findRoom(
      roomId,
      userId,
    );
    if (!participant)
      throw new AppException(CHAT_ERRORS.FORBIDDEN_NOT_PARTICIPANT);
    const messages = await this.consultationChatRepository.findMessages(
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
}
