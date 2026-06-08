import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { MyCommentSort } from './dto/my-comments-query.dto';
import { MyPostSort } from './dto/my-posts-query.dto';
import {
  myCommentListSelect,
  myPostListSelect,
  userWithProfilesInclude,
} from './users.types';

import type {
  MyCommentListItem,
  MyPostListItem,
  UserWithProfiles,
} from './users.types';
import type { CreateOAuthUserParams } from '../auth/oauth/oauth.types';
import type {
  AuthProvider,
  CommunityCategory,
  Prisma,
  User,
} from '@prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  findByProviderId(provider: AuthProvider, providerId: string) {
    return this.prisma.user.findUnique({
      where: {
        provider_providerId: {
          provider,
          providerId,
        },
      },
    });
  }

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  findByIdWithProfiles(id: string): Promise<UserWithProfiles | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: userWithProfilesInclude,
    });
  }

  create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  createOAuthUser(params: CreateOAuthUserParams): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: params.email,
        name: params.name,
        provider: params.provider,
        providerId: params.providerId,
        profileImageUrl: params.profileImageUrl ?? null,
        role: params.role,
      },
    });
  }

  update(
    id: string,
    data: Prisma.UserUpdateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<User> {
    const client = tx ?? this.prisma;
    return client.user.update({ where: { id }, data });
  }

  updatePassword(id: string, hashedPassword: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  findAllPostsByUserId(args: {
    userId: string;
    skip: number;
    take: number;
    sort: MyPostSort;
    category?: CommunityCategory;
  }): Promise<MyPostListItem[]> {
    const where: Prisma.CommunityPostWhereInput = {
      userId: args.userId,
      deletedAt: null,
      ...(args.category !== undefined && { category: args.category }),
    };
    const orderBy =
      args.sort === 'likes'
        ? [
            { likeRecords: { _count: 'desc' as const } },
            { createdAt: 'desc' as const },
          ]
        : args.sort === 'comments'
          ? [
              { comments: { _count: 'desc' as const } },
              { createdAt: 'desc' as const },
            ]
          : [{ createdAt: 'desc' as const }];
    return this.prisma.communityPost.findMany({
      where,
      select: myPostListSelect,
      orderBy,
      skip: args.skip,
      take: args.take,
    });
  }

  countPosts(userId: string, category?: CommunityCategory): Promise<number> {
    return this.prisma.communityPost.count({
      where: {
        userId,
        deletedAt: null,
        ...(category !== undefined && { category }),
      },
    });
  }

  findAllComments(args: {
    userId: string;
    skip: number;
    take: number;
    sort: MyCommentSort;
  }): Promise<MyCommentListItem[]> {
    const orderBy =
      args.sort === 'oldest'
        ? { createdAt: 'asc' as const }
        : { createdAt: 'desc' as const };

    return this.prisma.comment.findMany({
      where: {
        userId: args.userId,
        deletedAt: null,
        post: {
          deletedAt: null,
        },
      },
      select: myCommentListSelect,
      orderBy,
      skip: args.skip,
      take: args.take,
    });
  }

  countComments(userId: string): Promise<number> {
    return this.prisma.comment.count({
      where: {
        userId,
        deletedAt: null,
        post: {
          deletedAt: null,
        },
      },
    });
  }
}
