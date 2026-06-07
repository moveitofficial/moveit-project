import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

import type { CreateAdminParams } from './admin-account.types';
import type { GetAdminsQueryDto } from './dto/list/admins-query.dto';
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

  findById(id: string): Promise<Admin | null> {
    return this.prisma.admin.findUnique({ where: { id } });
  }

  async resetPassword(id: string, hashedPassword: string): Promise<void> {
    await this.prisma.admin.update({
      where: { id },
      data: {
        password: hashedPassword,
        mustChangePassword: true,
      },
    });
  }

  create(data: CreateAdminParams): Promise<Admin> {
    return this.prisma.admin.create({ data });
  }

  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    await this.prisma.admin.update({
      where: { id },
      data: {
        password: hashedPassword,
        mustChangePassword: false,
      },
    });
  }

  countAdmins(query: GetAdminsQueryDto): Promise<number> {
    return this.prisma.admin.count({
      where: this.#buildAdminsWhere(query),
    });
  }

  findAdmins(query: GetAdminsQueryDto, skip: number, take: number) {
    return this.prisma.admin.findMany({
      where: this.#buildAdminsWhere(query),
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });
  }

  #buildAdminsWhere(query: GetAdminsQueryDto): Prisma.AdminWhereInput {
    const { search } = query;

    return {
      isSuper: false,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };
  }

  findAdminDetailById(id: string) {
    return this.prisma.admin.findFirst({
      where: { id, isSuper: false },
      select: { id: true, email: true, name: true },
    });
  }
}
