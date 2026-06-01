import { Injectable } from '@nestjs/common';
import { CsChatStatus, SenderType } from '@prisma/client';

import { CS_CHAT_ERRORS } from '../../common/constants/errors';
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
    await this.csChatRepository.assignAdmin(roomId, socketData.adminId);
  }
}
