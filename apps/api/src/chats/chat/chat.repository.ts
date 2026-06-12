import { Injectable } from '@nestjs/common';
import {
  MessageReferenceType,
  MessageType,
  SystemMessageType,
} from '@prisma/client';

import { CHAT_ERRORS } from '../../common/constants/errors';
import { AppException } from '../../common/exceptions/app.exception';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ChatRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createRoom(data: {
    clientUserId: string;
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
  }) {
    return this.prisma.$transaction(async (tx) => {
      const service = await tx.service.findUnique({
        where: { id: data.serviceId },
        select: { expertUserId: true },
      });
      if (service?.expertUserId !== data.expertUserId) {
        throw new AppException(CHAT_ERRORS.INVALID_EXPERT);
      }

      const existing = await tx.chatRoom.findUnique({
        where: {
          clientUserId_expertUserId_currentServiceId: {
            clientUserId: data.clientUserId,
            expertUserId: data.expertUserId,
            currentServiceId: data.serviceId,
          },
        },
        select: { id: true },
      });
      if (existing) throw new AppException(CHAT_ERRORS.ROOM_ALREADY_EXISTS);

      const room = await tx.chatRoom.create({
        data: {
          ...(data.roomId ? { id: data.roomId } : {}),
          clientUserId: data.clientUserId,
          expertUserId: data.expertUserId,
          currentServiceId: data.serviceId,
          participants: {
            createMany: {
              data: [
                { userId: data.clientUserId },
                { userId: data.expertUserId },
              ],
            },
          },
        },
      });

      const textMessage = await tx.message.create({
        data: {
          chatRoomId: room.id,
          senderId: data.clientUserId,
          type: MessageType.TEXT,
          content: data.content,
        },
      });

      let lastMessageId = textMessage.id;

      if (data.files && data.files.length > 0) {
        for (const file of data.files) {
          const fileMessage = await tx.message.create({
            data: {
              chatRoomId: room.id,
              senderId: data.clientUserId,
              type: MessageType.FILE,
              content: '파일을 보냈습니다.',
              attachments: {
                create: {
                  fileUrl: file.url,
                  fileName: file.fileName,
                  fileType: file.fileType,
                  fileSize: file.fileSize,
                },
              },
            },
          });
          lastMessageId = fileMessage.id;
        }
      }

      return tx.chatRoom.update({
        where: { id: room.id },
        data: { lastMessageId },
        include: {
          clientUser: {
            select: {
              id: true,
              name: true,
              profileImageUrl: true,
              clientProfile: { select: { nickname: true } },
            },
          },
          expertUser: {
            select: {
              id: true,
              profileImageUrl: true,
              expertProfile: { select: { businessName: true } },
            },
          },
          lastMessage: { select: { id: true, content: true, createdAt: true } },
          participants: { select: { userId: true, lastReadMessageId: true } },
        },
      });
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

  async createFileMessage(data: {
    chatRoomId: string;
    senderId: string;
    attachment: {
      fileUrl: string;
      fileName: string;
      fileType: string;
      fileSize: number;
    };
  }) {
    return this.prisma.$transaction(async (tx) => {
      const message = await tx.message.create({
        data: {
          chatRoomId: data.chatRoomId,
          senderId: data.senderId,
          type: MessageType.FILE,
          content: '파일을 보냈습니다.',
          attachments: { create: data.attachment },
        },
        include: { attachments: true },
      });
      await tx.chatRoom.update({
        where: { id: data.chatRoomId },
        data: { lastMessageId: message.id },
      });
      return message;
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

  #buildRoomsWhere(userId: string, search?: string) {
    return {
      AND: [
        { OR: [{ clientUserId: userId }, { expertUserId: userId }] },
        { lastMessage: { isNot: null } },
        ...(search
          ? [
              {
                OR: [
                  {
                    clientUser: {
                      clientProfile: {
                        nickname: {
                          contains: search,
                          mode: 'insensitive' as const,
                        },
                      },
                    },
                  },
                  {
                    clientUser: {
                      name: {
                        contains: search,
                        mode: 'insensitive' as const,
                      },
                    },
                  },
                  {
                    expertUser: {
                      expertProfile: {
                        businessName: {
                          contains: search,
                          mode: 'insensitive' as const,
                        },
                      },
                    },
                  },
                ],
              },
            ]
          : []),
      ],
    };
  }

  countRooms(userId: string, search?: string) {
    return this.prisma.chatRoom.count({
      where: this.#buildRoomsWhere(userId, search),
    });
  }

  findAllRooms(userId: string, search?: string, page = 1, limit = 20) {
    return this.prisma.chatRoom.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: this.#buildRoomsWhere(userId, search),
      include: {
        clientUser: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true,
            clientProfile: { select: { nickname: true } },
          },
        },
        expertUser: {
          select: {
            id: true,
            profileImageUrl: true,
            expertProfile: { select: { businessName: true } },
          },
        },
        lastMessage: { select: { id: true, content: true, createdAt: true } },
        participants: { select: { userId: true, lastReadMessageId: true } },
      },
      orderBy: { lastMessage: { createdAt: 'desc' } },
    });
  }

  findMessages(roomId: string, cursor?: string, limit = 30) {
    return this.prisma.message.findMany({
      where: { chatRoomId: roomId },
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findUnreadRooms(userId: string) {
    const participants = await this.prisma.chatParticipant.findMany({
      where: {
        userId,
        chatRoom: { lastMessage: { isNot: null } },
      },
      orderBy: { chatRoom: { lastMessage: { createdAt: 'desc' } } },
      include: {
        chatRoom: {
          include: {
            lastMessage: {
              select: { id: true, content: true, createdAt: true },
            },
            clientUser: {
              select: {
                id: true,
                name: true,
                profileImageUrl: true,
                clientProfile: { select: { nickname: true } },
              },
            },
            expertUser: {
              select: {
                id: true,
                profileImageUrl: true,
                expertProfile: { select: { businessName: true } },
              },
            },
          },
        },
        lastReadMessage: { select: { createdAt: true } },
        lastDismissedMessage: { select: { createdAt: true } },
      },
    });

    return participants.filter((p) => {
      const lastMessage = p.chatRoom.lastMessage;
      if (!lastMessage) return false;
      const readAt = p.lastReadMessage?.createdAt ?? new Date(0);
      const dismissedAt = p.lastDismissedMessage?.createdAt ?? new Date(0);
      return (
        lastMessage.createdAt > readAt && lastMessage.createdAt > dismissedAt
      );
    });
  }

  async findRoomParticipantIds(roomId: string) {
    return this.prisma.chatRoom.findUnique({
      where: { id: roomId },
      select: { clientUserId: true, expertUserId: true },
    });
  }

  async updateDismissedMessage(roomId: string, userId: string) {
    const room = await this.prisma.chatRoom.findUnique({
      where: { id: roomId },
      select: { lastMessageId: true },
    });
    if (!room?.lastMessageId) return;
    return this.prisma.chatParticipant.update({
      where: { chatRoomId_userId: { chatRoomId: roomId, userId } },
      data: { lastDismissedMessageId: room.lastMessageId },
    });
  }

  async updateAllDismissedMessages(userId: string) {
    const participants = await this.prisma.chatParticipant.findMany({
      where: { userId },
      select: {
        chatRoomId: true,
        chatRoom: { select: { lastMessageId: true } },
      },
    });
    await this.prisma.$transaction(
      participants
        .filter((p) => p.chatRoom.lastMessageId)
        .map((p) =>
          this.prisma.chatParticipant.update({
            where: { chatRoomId_userId: { chatRoomId: p.chatRoomId, userId } },
            data: { lastDismissedMessageId: p.chatRoom.lastMessageId },
          }),
        ),
    );
  }
}
