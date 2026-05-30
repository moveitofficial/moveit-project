import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CustomerSupportRepository {
  constructor(private readonly prisma: PrismaService) {}
}
