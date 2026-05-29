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

  findAllPosts(args: { skip: number; take: number }) {
    return this.prisma.communityPost.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      skip: args.skip,
      take: args.take,
      select: {
        id: true,
        userId: true,
        category: true,
        title: true,
        content: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            role: true,
            name: true,
            clientProfile: { select: { nickname: true } },
            expertProfile: { select: { businessName: true } },
          },
        },
        _count: {
          select: {
            comments: { where: { deletedAt: null } },
            likeRecords: true,
          },
        },
      },
    });
  }

  countPosts(): Promise<number> {
    return this.prisma.communityPost.count({
      where: { deletedAt: null },
    });
  }
}
