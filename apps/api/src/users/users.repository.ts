import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import type { CreateOAuthUserParams } from '../auth/oauth/oauth-user';
import type { AuthProvider, Prisma, User } from '@prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  findByProviderId(provider: AuthProvider, providerId: string) {
    return this.prisma.user.findUnique({
      where: {
        provider_providerId: {
          provider,
          providerId,
        },
      },
    });
  }

  create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  createOAuthUser(params: CreateOAuthUserParams): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: params.email,
        name: params.name,
        provider: params.provider,
        providerId: params.providerId,
        profileImageUrl: params.profileImageUrl ?? null,
        role: params.role,
      },
    });
  }
}
