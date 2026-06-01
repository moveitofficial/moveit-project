import { Injectable } from '@nestjs/common';

import { CHAT_ERRORS } from '../../common/constants/errors';
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
    const participant = await this.consultationChatRepository.findParticipant(
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
}
