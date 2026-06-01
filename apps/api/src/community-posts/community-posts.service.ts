import { Injectable } from '@nestjs/common';

import {
  COMMENTS_ERRORS,
  COMMUNITY_POSTS_ERRORS,
} from '../common/constants/errors';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { AppException } from '../common/exceptions/app.exception';
import { Paginated } from '../common/types/paginated.type';
import { toPaginatedResponse } from '../common/utils/list-response.util';

import {
  mapComment,
  mapCommentListItem,
  mapPost,
  mapPostDetail,
  mapPostListItem,
  mapPostToBeDeleted,
} from './community-posts.mapper';
import { CommunityPostsRepository } from './community-posts.repository';
import {
  COMMENT_MAX_LENGTH,
  getPostContentPlainTextLength,
  POST_MIN_LENGTH,
  sanitizePostContent,
} from './community-posts.util';
import { PostListQueryDto } from './dto/post-list-query.dto';
import {
  CommentRequestDto,
  PostRequestDto,
  UpdatePostRequestDto,
} from './dto/post-request.dto';
import {
  CommentListItemResponseDto,
  PostListItemResponseDto,
} from './dto/post-response.dto';

import type { CommunityCategory } from '@prisma/client';

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

  async getPost(
    postId: string,
    userId?: string,
  ): Promise<ReturnType<typeof mapPostDetail>> {
    const post = await this.communityPostsRepository.findPostDetailById(postId);
    if (post === null) {
      throw new AppException(COMMUNITY_POSTS_ERRORS.NOT_FOUND);
    }

    if (post.deletedAt !== null) {
      throw new AppException(COMMUNITY_POSTS_ERRORS.ALREADY_DELETED);
    }

    const isLiked = userId
      ? await this.communityPostsRepository.isLikedByUser(postId, userId)
      : false;
    return mapPostDetail(post, isLiked);
  }

  async deletePost(
    postId: string,
    userId: string,
  ): Promise<ReturnType<typeof mapPostToBeDeleted>> {
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

    const toBeDeleted = await this.communityPostsRepository.deletePost(postId);

    return mapPostToBeDeleted(toBeDeleted);
  }

  async updatePost(
    userId: string,
    postId: string,
    dto: UpdatePostRequestDto,
  ): Promise<ReturnType<typeof mapPost>> {
    if (
      dto.category === undefined &&
      dto.title === undefined &&
      dto.content === undefined
    ) {
      throw new AppException(COMMUNITY_POSTS_ERRORS.NOTHING_TO_UPDATE);
    }

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

    const updateData: {
      category?: CommunityCategory;
      title?: string;
      content?: string;
    } = {};

    if (dto.category !== undefined) {
      updateData.category = dto.category;
    }

    if (dto.title !== undefined) {
      updateData.title = dto.title.trim();
    }

    if (dto.content !== undefined) {
      const sanitizedContent = sanitizePostContent(dto.content);
      const plainTextLength = getPostContentPlainTextLength(sanitizedContent);

      if (plainTextLength < POST_MIN_LENGTH) {
        throw new AppException(COMMUNITY_POSTS_ERRORS.CONTENT_TOO_SHORT);
      }

      updateData.content = sanitizedContent;
    }

    const updated = await this.communityPostsRepository.updatePost(
      postId,
      updateData,
    );

    return mapPost(updated);
  }

  async toggleLike(postId: string, userId: string) {
    const post = await this.communityPostsRepository.findByPostId(postId);

    if (post === null) {
      throw new AppException(COMMUNITY_POSTS_ERRORS.NOT_FOUND);
    }

    if (post.deletedAt !== null) {
      throw new AppException(COMMUNITY_POSTS_ERRORS.ALREADY_DELETED);
    }

    const isLiked = await this.communityPostsRepository.isLikedByUser(
      postId,
      userId,
    );

    await (isLiked
      ? this.communityPostsRepository.unlikePost(postId, userId)
      : this.communityPostsRepository.likePost(postId, userId));

    return { isLiked: !isLiked };
  }

  async createComment(
    userId: string,
    postId: string,
    dto: CommentRequestDto,
  ): Promise<ReturnType<typeof mapComment>> {
    const post = await this.communityPostsRepository.findByPostId(postId);

    if (post === null) {
      throw new AppException(COMMUNITY_POSTS_ERRORS.NOT_FOUND);
    }

    if (post.deletedAt !== null) {
      throw new AppException(COMMUNITY_POSTS_ERRORS.ALREADY_DELETED);
    }

    const sanitizedContent = sanitizePostContent(dto.content);
    const plainTextLength = getPostContentPlainTextLength(sanitizedContent);

    if (plainTextLength < POST_MIN_LENGTH) {
      throw new AppException(COMMENTS_ERRORS.CONTENT_TOO_SHORT);
    }

    if (plainTextLength > COMMENT_MAX_LENGTH) {
      throw new AppException(COMMENTS_ERRORS.CONTENT_TOO_LONG);
    }

    const comment = await this.communityPostsRepository.createComment(
      postId,
      userId,
      dto,
    );
    return mapComment(comment);
  }

  async getComments(
    postId: string,
    query: PaginationQueryDto,
  ): Promise<Paginated<CommentListItemResponseDto>> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;
    const skip = (page - 1) * pageSize;

    const post = await this.communityPostsRepository.findByPostId(postId);

    if (post === null) {
      throw new AppException(COMMUNITY_POSTS_ERRORS.NOT_FOUND);
    }

    if (post.deletedAt !== null) {
      throw new AppException(COMMUNITY_POSTS_ERRORS.ALREADY_DELETED);
    }

    const [comments, totalCount] = await Promise.all([
      this.communityPostsRepository.findAllComments({
        postId,
        skip,
        take: pageSize,
      }),
      this.communityPostsRepository.countComments(postId),
    ]);

    return toPaginatedResponse(
      comments.map((comment) => mapCommentListItem(comment)),
      { page, pageSize, totalCount },
    );
  }
}
