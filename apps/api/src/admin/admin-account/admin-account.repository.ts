import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import type { CreateAdminParams } from './admin-account.types';
import type { Admin } from '@prisma/client';

@Injectable()
export class AdminAccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string): Promise<Admin | null> {
    return this.prisma.admin.findUnique({ where: { email } });
  }

  async updateLastLoginAt(id: string): Promise<void> {
    await this.prisma.admin.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }

  create(data: CreateAdminParams): Promise<Admin> {
    return this.prisma.admin.create({ data });
  }
}
