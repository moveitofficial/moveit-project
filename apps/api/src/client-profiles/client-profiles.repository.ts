import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import type { ClientProfile } from '@prisma/client';

@Injectable()
export class ClientProfilesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByUserId(userId: string): Promise<ClientProfile | null> {
    return this.prisma.clientProfile.findUnique({
      where: { userId },
    });
  }
}
