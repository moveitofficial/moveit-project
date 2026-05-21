import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { clientProfileInclude } from './client-profiles.types';

import type { ClientProfileWithCategories } from './client-profiles.types';
import type { CategoryInput } from '../common/types/category.types';
import type { ClientProfile, Prisma } from '@prisma/client';

@Injectable()
export class ClientProfilesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByUserId(userId: string): Promise<ClientProfile | null> {
    return this.prisma.clientProfile.findUnique({
      where: { userId },
    });
  }

  create(
    userId: string,
    data: { nickname?: string; interestCategories?: CategoryInput[] },
    tx?: Prisma.TransactionClient,
  ): Promise<ClientProfileWithCategories> {
    const args = {
      data: {
        userId,
        nickname: data.nickname,
        interestCategories: {
          create:
            data.interestCategories?.map((c) => ({
              serviceGroup: { connect: { name: c.group } },
              serviceCategory: { connect: { name: c.category } },
            })) ?? [],
        },
      },
      include: clientProfileInclude,
    } satisfies Prisma.ClientProfileCreateArgs;

    if (tx) return tx.clientProfile.create(args);
    return this.prisma.clientProfile.create(args);
  }

  update(
    userId: string,
    data: { nickname?: string; interestCategories?: CategoryInput[] },
    tx?: Prisma.TransactionClient,
  ): Promise<ClientProfileWithCategories> {
    const args = {
      where: { userId },
      data: {
        nickname: data.nickname,
        interestCategories:
          data.interestCategories === undefined
            ? undefined
            : {
                deleteMany: {},
                create: data.interestCategories.map((c) => ({
                  serviceGroup: { connect: { name: c.group } },
                  serviceCategory: { connect: { name: c.category } },
                })),
              },
      },
      include: clientProfileInclude,
    } satisfies Prisma.ClientProfileUpdateArgs;

    if (tx) return tx.clientProfile.update(args);
    return this.prisma.clientProfile.update(args);
  }
}
