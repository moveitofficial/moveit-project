import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import type { ClientProfile, Prisma } from '@prisma/client';

@Injectable()
export class ClientProfilesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByUserId(userId: string): Promise<ClientProfile | null> {
    return this.prisma.clientProfile.findUnique({
      where: { userId },
    });
  }

  update(
    userId: string,
    data: { nickname?: string },
  ): Promise<
    Prisma.ClientProfileGetPayload<{ include: { interestCategories: true } }>
  > {
    return this.prisma.clientProfile.update({
      where: { userId },
      data,
      include: { interestCategories: true },
    });
  }
}
