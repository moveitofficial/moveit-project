import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FaqsRepository {
  constructor(private readonly prisma: PrismaService) {}
}
