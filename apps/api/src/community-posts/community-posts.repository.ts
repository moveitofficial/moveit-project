import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommunityPostsRepository {
  constructor(private readonly prisma: PrismaService) {}
}
