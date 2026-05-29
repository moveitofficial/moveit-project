import { Injectable } from '@nestjs/common';

import { COMMUNITY_POSTS_ERRORS } from '../common/constants/errors';
import { AppException } from '../common/exceptions/app.exception';
import { Paginated } from '../common/types/paginated.type';
import { toPaginatedResponse } from '../common/utils/list-response.util';

import { mapPost, mapPostListItem } from './community-posts.mapper';
import { CommunityPostsRepository } from './community-posts.repository';
import {
  getPostContentPlainTextLength,
  POST_MIN_LENGTH,
  sanitizePostContent,
} from './community-posts.util';
import { PostListQueryDto } from './dto/post-list-query.dto';
import { PostRequestDto } from './dto/post-request.dto';
import { PostListItemResponseDto } from './dto/post-response.dto';

@Injectable()
export class CommunityPostsService {
  constructor(
    private readonly communityPostsRepository: CommunityPostsRepository,
  ) {}

  async createPost(
    userId: string,
    dto: PostRequestDto,
  ): Promise<ReturnType<typeof mapPost>> {
    const sanitizedContent = sanitizePostContent(dto.content);
    const plainTextLength = getPostContentPlainTextLength(sanitizedContent);

    if (plainTextLength < POST_MIN_LENGTH) {
      throw new AppException(COMMUNITY_POSTS_ERRORS.CONTENT_TOO_SHORT);
    }

    const created = await this.communityPostsRepository.createPost(userId, {
      category: dto.category,
      title: dto.title.trim(),
      content: sanitizedContent,
    });

    return mapPost(created);
  }

  async getAllPosts(
    query: PostListQueryDto,
  ): Promise<Paginated<PostListItemResponseDto>> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const skip = (page - 1) * pageSize;
    const category = query.category;
    const [posts, totalCount] = await Promise.all([
      this.communityPostsRepository.findAllPosts({
        skip,
        take: pageSize,
        category,
      }),
      this.communityPostsRepository.countPosts(category),
    ]);
    return toPaginatedResponse(
      posts.map((post) => mapPostListItem(post)),
      { page, pageSize, totalCount },
    );
  }

  async updatePost(
    userId: string,
    postId: string,
    dto: PostRequestDto,
  ): Promise<ReturnType<typeof mapPost>> {
    const post = await this.communityPostsRepository.findByPostId(postId);

    if (post === null) {
      throw new AppException(COMMUNITY_POSTS_ERRORS.NOT_FOUND);
    }

    if (post.deletedAt !== null) {
      throw new AppException(COMMUNITY_POSTS_ERRORS.ALREADY_DELETED);
    }

    if (post.userId !== userId) {
      throw new AppException(COMMUNITY_POSTS_ERRORS.FORBIDDEN);
    }

    const sanitizedContent = sanitizePostContent(dto.content);
    const plainTextLength = getPostContentPlainTextLength(sanitizedContent);

    if (plainTextLength < POST_MIN_LENGTH) {
      throw new AppException(COMMUNITY_POSTS_ERRORS.CONTENT_TOO_SHORT);
    }

    const updated = await this.communityPostsRepository.updatePost(postId, {
      category: dto.category,
      title: dto.title.trim(),
      content: sanitizedContent,
    });

    return mapPost(updated);
  }
}
