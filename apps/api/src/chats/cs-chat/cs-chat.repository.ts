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

  async createFileMessage(data: {
    chatRoomId: string;
    senderType: SenderType;
    senderUserId?: string;
    senderAdminId?: string;
    attachment: {
      fileUrl: string;
      fileName: string;
      fileType: string;
      fileSize: number;
    };
  }) {
    return this.prisma.$transaction(async (tx) => {
      const message = await tx.csMessage.create({
        data: {
          chatRoomId: data.chatRoomId,
          senderType: data.senderType,
          senderUserId: data.senderUserId,
          senderAdminId: data.senderAdminId,
          type: MessageType.FILE,
          content: '파일을 보냈습니다.',
          attachments: { create: data.attachment },
        },
        include: { attachments: true },
      });
      await tx.csChatRoom.update({
        where: { id: data.chatRoomId },
        data: { lastMessageId: message.id },
      });
      return message;
    });
  }

  async createRoomWithFirstMessage(userId: string, content: string) {
    return this.prisma.$transaction(async (tx) => {
      const room = await tx.csChatRoom.create({
        data: { userId, status: CsChatStatus.OPEN },
      });
      const message = await tx.csMessage.create({
        data: {
          chatRoomId: room.id,
          senderType: SenderType.USER,
          senderUserId: userId,
          type: MessageType.TEXT,
          content,
        },
      });
      return tx.csChatRoom.update({
        where: { id: room.id },
        data: { lastMessageId: message.id },
        include: {
          lastMessage: { select: { id: true, content: true, createdAt: true } },
        },
      });
    });
  }

  findAllRoomsByUser(userId: string, page = 1, limit = 20) {
    return this.prisma.csChatRoom.findMany({
      where: { userId, lastMessage: { isNot: null } },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        lastMessage: { select: { id: true, content: true, createdAt: true } },
      },
      orderBy: { lastMessage: { createdAt: 'desc' } },
    });
  }

  countRoomsByUser(userId: string) {
    return this.prisma.csChatRoom.count({
      where: { userId, lastMessage: { isNot: null } },
    });
  }

  #buildAdminWhere(search?: string) {
    return {
      lastMessage: { isNot: null },
      ...(search
        ? {
            user: {
              OR: [
                { name: { contains: search, mode: 'insensitive' as const } },
                {
                  clientProfile: {
                    nickname: {
                      contains: search,
                      mode: 'insensitive' as const,
                    },
                  },
                },
                {
                  expertProfile: {
                    businessName: {
                      contains: search,
                      mode: 'insensitive' as const,
                    },
                  },
                },
              ],
            },
          }
        : {}),
    };
  }

  findAllRoomsForAdmin(search?: string, page = 1, limit = 20) {
    return this.prisma.csChatRoom.findMany({
      where: this.#buildAdminWhere(search),
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true,
            clientProfile: { select: { nickname: true } },
            expertProfile: { select: { businessName: true } },
          },
        },
        assignedAdmin: { select: { id: true, name: true } },
        lastMessage: { select: { id: true, content: true, createdAt: true } },
      },
      orderBy: { lastMessage: { createdAt: 'desc' } },
    });
  }

  countRoomsForAdmin(search?: string) {
    return this.prisma.csChatRoom.count({
      where: this.#buildAdminWhere(search),
    });
  }

  findMessages(roomId: string, cursor?: string, limit = 30) {
    return this.prisma.csMessage.findMany({
      where: { chatRoomId: roomId },
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
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
