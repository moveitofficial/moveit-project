import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { serviceInclude } from './services.types';

import type { ServiceWithRelations } from './services.types';
import type { Prisma } from '@prisma/client';

@Injectable()
export class ServicesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    data: Prisma.ServiceUncheckedCreateInput,
  ): Promise<ServiceWithRelations> {
    return this.prisma.service.create({ data, include: serviceInclude });
  }

  findMany(): Promise<ServiceWithRelations[]> {
    return this.prisma.service.findMany({ include: serviceInclude });
  }

  findById(id: string): Promise<ServiceWithRelations | null> {
    return this.prisma.service.findUnique({
      where: { id },
      include: serviceInclude,
    });
  }

  update(
    id: string,
    data: Prisma.ServiceUncheckedUpdateInput,
  ): Promise<ServiceWithRelations> {
    return this.prisma.service.update({
      where: { id },
      data,
      include: serviceInclude,
    });
  }
}
