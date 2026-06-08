import { Injectable } from '@nestjs/common';

import { CHAT_ERRORS } from '../../common/constants/errors';
import { AppException } from '../../common/exceptions/app.exception';
import { toWsException } from '../../common/utils/ws-exception.util';

import { ConsultationChatRepository } from './consultation-chat.repository';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ConsultationChatService {
  constructor(
    private readonly consultationChatRepository: ConsultationChatRepository,
  ) {}

  async getOrCreateRoom(
    clientUserId: string,
    expertUserId: string,
    serviceId: string,
  ) {
    return this.consultationChatRepository.findOrCreateRoom(
      clientUserId,
      expertUserId,
      serviceId,
    );
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

  async getRooms(userId: string) {
    const rooms = await this.consultationChatRepository.findAllRooms(userId);
    return rooms.map((room) => ({
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
  }

  async getMessages(roomId: string, userId: string) {
    const participant = await this.consultationChatRepository.findRoom(
      roomId,
      userId,
    );
    if (!participant)
      throw new AppException(CHAT_ERRORS.FORBIDDEN_NOT_PARTICIPANT);
    return await this.consultationChatRepository.findMessages(roomId);
  }
}
