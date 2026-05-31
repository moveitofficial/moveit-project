import { Injectable } from '@nestjs/common';
import { CommunityCategory, CommunityPost } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import {
  PostDetailItem,
  postDetailSelect,
  postListSelect,
} from './community-posts.types';
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

  updatePost(postId: string, dto: PostRequestDto): Promise<CommunityPost> {
    const args = {
      where: { id: postId },
      data: {
        category: dto.category,
        title: dto.title,
        content: dto.content,
      },
    };
    return this.prisma.communityPost.update(args);
  }

  findByPostId(postId: string): Promise<CommunityPost | null> {
    return this.prisma.communityPost.findUnique({
      where: { id: postId },
    });
  }

  findPostDetailById(postId: string): Promise<PostDetailItem | null> {
    return this.prisma.communityPost.findUnique({
      where: {
        id: postId,
      },
      select: postDetailSelect,
    });
  }

  buildListWhere(category?: CommunityCategory) {
    return {
      deletedAt: null,
      ...(category !== undefined && { category }),
    };
  }

  findAllPosts(args: {
    skip: number;
    take: number;
    category?: CommunityCategory;
  }) {
    return this.prisma.communityPost.findMany({
      where: this.buildListWhere(args.category),
      orderBy: { createdAt: 'desc' },
      skip: args.skip,
      take: args.take,
      select: postListSelect,
    });
  }

  countPosts(category?: CommunityCategory): Promise<number> {
    return this.prisma.communityPost.count({
      where: this.buildListWhere(category),
    });
  }

  async isLikedByUser(postId: string, userId: string): Promise<boolean> {
    const like = await this.prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
      select: {
        id: true,
      },
    });
    return like !== null;
  }
}
