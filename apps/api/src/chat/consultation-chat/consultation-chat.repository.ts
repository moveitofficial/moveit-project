import { Injectable } from '@nestjs/common';
import {
  MessageReferenceType,
  MessageType,
  SystemMessageType,
} from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ConsultationChatRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOrCreateRoom(
    clientUserId: string,
    expertUserId: string,
    currentServiceId: string,
  ) {
    return this.prisma.chatRoom.upsert({
      where: {
        clientUserId_expertUserId_currentServiceId: {
          clientUserId,
          expertUserId,
          currentServiceId,
        },
      },
      create: {
        clientUserId,
        expertUserId,
        currentServiceId,
        participants: {
          createMany: {
            data: [{ userId: clientUserId }, { userId: expertUserId }],
          },
        },
      },
      update: {},
    });
  }

  async findRoom(roomId: string, userId: string) {
    return this.prisma.chatParticipant.findUnique({
      where: { chatRoomId_userId: { chatRoomId: roomId, userId } },
    });
  }

  async updateLastRead(roomId: string, userId: string, messageId: string) {
    return this.prisma.chatParticipant.update({
      where: { chatRoomId_userId: { chatRoomId: roomId, userId } },
      data: { lastReadMessageId: messageId },
    });
  }

  async createMessage(data: {
    chatRoomId: string;
    senderId: string;
    type: MessageType;
    content: string;
    systemType?: SystemMessageType;
    referenceType?: MessageReferenceType;
    referenceId?: string;
  }) {
    const message = await this.prisma.message.create({ data });
    await this.prisma.chatRoom.update({
      where: { id: data.chatRoomId },
      data: { lastMessageId: message.id },
    });
    return message;
  }

  findAllRooms(userId: string) {
    return this.prisma.chatRoom.findMany({
      where: {
        OR: [{ clientUserId: userId }, { expertUserId: userId }],
      },
      include: { lastMessage: true },
      orderBy: { lastMessage: { createdAt: 'desc' } },
    });
  }

  findMessages(roomId: string) {
    return this.prisma.message.findMany({
      where: { chatRoomId: roomId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
