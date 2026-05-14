import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CatalogsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAllServiceGroups() {
    return this.prisma.serviceGroup.findMany();
  }

  findAllServiceCategories() {
    return this.prisma.serviceCategory.findMany();
  }

  findAllTechStacks() {
    return this.prisma.techStack.findMany();
  }
}
