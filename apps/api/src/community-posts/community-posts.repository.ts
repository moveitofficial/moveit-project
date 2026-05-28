import { Injectable } from '@nestjs/common';
import { CommunityPost } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { PostRequestDto } from './dto/post-request.dto';

@Injectable()
export class CommunityPostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  createPost(userId: string, dto: PostRequestDto): Promise<CommunityPost> {
    const args = {
      data: {
        userId,
        category: dto.category,
        title: dto.title,
        content: dto.content,
      },
    };

    return this.prisma.communityPost.create(args);
  }
}
