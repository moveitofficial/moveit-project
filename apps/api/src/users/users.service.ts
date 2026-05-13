import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import type { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  getAllUser() {
    return 'all user';
  }

  findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
