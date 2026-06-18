import { Injectable } from '@nestjs/common';
import { Comment, CommunityCategory, CommunityPost } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import {
  commentListSelect,
  PostDetailItem,
  postDetailSelect,
  postListSelect,
} from './community-posts.types';
import { CommentRequestDto, PostRequestDto } from './dto/post-request.dto';

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

  updatePost(
    postId: string,
    data: {
      category?: CommunityCategory;
      title?: string;
      content?: string;
    },
  ): Promise<CommunityPost> {
    return this.prisma.communityPost.update({
      where: { id: postId },
      data,
    });
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

  deletePost(postId: string): Promise<CommunityPost> {
    return this.prisma.communityPost.update({
      where: { id: postId },
      data: { deletedAt: new Date() },
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

  async likePost(postId: string, userId: string): Promise<void> {
    await this.prisma.like.upsert({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
      update: {},
      create: {
        userId,
        postId,
      },
    });
  }

  async unlikePost(postId: string, userId: string): Promise<void> {
    await this.prisma.like.deleteMany({
      where: {
        userId,
        postId,
      },
    });
  }

  createComment(
    postId: string,
    userId: string,
    dto: CommentRequestDto,
  ): Promise<Comment> {
    const args = {
      data: {
        postId,
        userId,
        content: dto.content.trim(),
      },
    };

    return this.prisma.comment.create(args);
  }

  findComment(commentId: string): Promise<Comment | null> {
    return this.prisma.comment.findUnique({
      where: { id: commentId },
    });
  }

  updateComment(
    commentId: string,
    data: {
      content?: string;
    },
  ): Promise<Comment> {
    return this.prisma.comment.update({
      where: { id: commentId },
      data,
    });
  }

  findAllComments(args: { postId: string; skip: number; take: number }) {
    return this.prisma.comment.findMany({
      where: this.buildCommentListWhere(args.postId),
      select: commentListSelect,
      orderBy: { createdAt: 'asc' },
      skip: args.skip,
      take: args.take,
    });
  }

  buildCommentListWhere(postId: string) {
    return {
      postId,
      deletedAt: null,
    };
  }

  countComments(postId: string): Promise<number> {
    return this.prisma.comment.count({
      where: this.buildCommentListWhere(postId),
    });
  }

  findPopularPostsPool(take: number) {
    return this.prisma.communityPost.findMany({
      where: { deletedAt: null },
      orderBy: { likeRecords: { _count: 'desc' } },
      take,
      select: postListSelect,
    });
  }

  deleteComment(commentId: string): Promise<Comment> {
    return this.prisma.comment.update({
      where: { id: commentId },
      data: { deletedAt: new Date() },
    });
  }
}
