import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import type { Prisma } from '@prisma/client';

@Injectable()
export class ServicesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.ServiceUncheckedCreateInput) {
    return this.prisma.service.create({ data });
  }

  findMany() {
    return this.prisma.service.findMany();
  }

  findById(id: string) {
    return this.prisma.service.findUnique({ where: { id } });
  }

  update(id: string, data: Prisma.ServiceUncheckedUpdateInput) {
    return this.prisma.service.update({ where: { id }, data });
  }
}
