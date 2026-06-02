import { Injectable } from '@nestjs/common';
import { CsChatStatus, MessageType, SenderType } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CsChatRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findRoom(roomId: string) {
    return this.prisma.csChatRoom.findUnique({
      where: { id: roomId },
    });
  }

  async updateLastRead(
    roomId: string,
    senderType: SenderType,
    messageId: string,
  ) {
    if (senderType === SenderType.USER) {
      return this.prisma.csChatRoom.update({
        where: { id: roomId },
        data: { userLastReadMessageId: messageId },
      });
    }
    return this.prisma.csChatRoom.update({
      where: { id: roomId },
      data: { adminLastReadMessageId: messageId },
    });
  }

  async createMessage(data: {
    chatRoomId: string;
    senderType: SenderType;
    senderUserId?: string;
    senderAdminId?: string;
    content: string;
    type: MessageType;
  }) {
    const message = await this.prisma.csMessage.create({ data });
    await this.prisma.csChatRoom.update({
      where: { id: data.chatRoomId },
      data: { lastMessageId: message.id },
    });
    return message;
  }

  async closeChatRoom(roomId: string) {
    await this.prisma.csChatRoom.update({
      where: { id: roomId },
      data: { status: CsChatStatus.CLOSED },
    });
  }

  async assignAdmin(roomId: string, adminId: string) {
    await this.prisma.csChatRoom.update({
      where: { id: roomId },
      data: { status: CsChatStatus.ASSIGNED, assignedAdminId: adminId },
    });
  }
}
