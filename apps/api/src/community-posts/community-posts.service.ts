import { Injectable } from '@nestjs/common';
import { NotificationCategory, type CommunityCategory } from '@prisma/client';
import { containsBannedWord } from '@repo/content-filter';

import {
  COMMENTS_ERRORS,
  COMMUNITY_POSTS_ERRORS,
} from '../common/constants/errors';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { AppException } from '../common/exceptions/app.exception';
import { Paginated } from '../common/types/paginated.type';
import { toPaginatedResponse } from '../common/utils/list-response.util';
import { NotificationsService } from '../notifications/notifications.service';

import {
  mapComment,
  mapCommentListItem,
  mapCommentToBeDeleted,
  mapPost,
  mapPostDetail,
  mapPostListItem,
  mapPostToBeDeleted,
} from './community-posts.mapper';
import { CommunityPostsRepository } from './community-posts.repository';
import {
  COMMENT_MAX_LENGTH,
  COMMENT_MIN_LENGTH,
  getPostContentPlainTextLength,
  POST_MIN_LENGTH,
  sanitizePostContent,
} from './community-posts.util';
import { PostListQueryDto } from './dto/post-list-query.dto';
import {
  CommentRequestDto,
  PostRequestDto,
  UpdateCommentRequestDto,
  UpdatePostRequestDto,
} from './dto/post-request.dto';
import {
  CommentListItemResponseDto,
  PostListItemResponseDto,
} from './dto/post-response.dto';

@Injectable()
export class CommunityPostsService {
  constructor(
    private readonly communityPostsRepository: CommunityPostsRepository,
    private readonly notificationsService: NotificationsService,
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

    if (containsBannedWord(dto.title) || containsBannedWord(sanitizedContent)) {
      throw new AppException(COMMUNITY_POSTS_ERRORS.CONTAINS_BANNED_WORD);
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
      if (containsBannedWord(dto.title)) {
        throw new AppException(COMMUNITY_POSTS_ERRORS.CONTAINS_BANNED_WORD);
      }
      updateData.title = dto.title.trim();
    }

    if (dto.content !== undefined) {
      const sanitizedContent = sanitizePostContent(dto.content);
      const plainTextLength = getPostContentPlainTextLength(sanitizedContent);

      if (plainTextLength < POST_MIN_LENGTH) {
        throw new AppException(COMMUNITY_POSTS_ERRORS.CONTENT_TOO_SHORT);
      }

      if (containsBannedWord(sanitizedContent)) {
        throw new AppException(COMMUNITY_POSTS_ERRORS.CONTAINS_BANNED_WORD);
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

    if (isLiked) {
      await this.communityPostsRepository.unlikePost(postId, userId);
    } else {
      await this.communityPostsRepository.likePost(postId, userId);

      if (post.userId !== userId) {
        await this.notificationsService.send({
          userIds: [post.userId],
          category: NotificationCategory.POST_LIKE,
          vars: { postTitle: post.title },
          referenceId: postId,
        });
      }
    }

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

    if (post.userId !== userId) {
      await this.notificationsService.send({
        userIds: [post.userId],
        category: NotificationCategory.POST_COMMENT,
        vars: { postTitle: post.title },
        referenceId: postId,
      });
    }

    return mapComment(comment);
  }

  async updateComment(
    userId: string,
    commentId: string,
    postId: string,
    dto: UpdateCommentRequestDto,
  ): Promise<ReturnType<typeof mapComment>> {
    if (dto.content === undefined) {
      throw new AppException(COMMENTS_ERRORS.NOTHING_TO_UPDATE);
    }

    if (dto.content.trim().length < COMMENT_MIN_LENGTH) {
      throw new AppException(COMMENTS_ERRORS.CONTENT_TOO_SHORT);
    }

    if (dto.content.trim().length > COMMENT_MAX_LENGTH) {
      throw new AppException(COMMENTS_ERRORS.CONTENT_TOO_LONG);
    }

    const post = await this.communityPostsRepository.findByPostId(postId);

    if (post === null) {
      throw new AppException(COMMUNITY_POSTS_ERRORS.NOT_FOUND);
    }

    if (post.deletedAt !== null) {
      throw new AppException(COMMUNITY_POSTS_ERRORS.ALREADY_DELETED);
    }

    const comment = await this.communityPostsRepository.findComment(commentId);
    if (comment === null) {
      throw new AppException(COMMENTS_ERRORS.NOT_FOUND);
    }

    if (comment.userId !== userId) {
      throw new AppException(COMMENTS_ERRORS.FORBIDDEN);
    }

    if (comment.deletedAt !== null) {
      throw new AppException(COMMENTS_ERRORS.ALREADY_DELETED);
    }

    const updated = await this.communityPostsRepository.updateComment(
      commentId,
      dto,
    );
    return mapComment(updated);
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

  async deleteComment(
    userId: string,
    postId: string,
    commentId: string,
  ): Promise<ReturnType<typeof mapCommentToBeDeleted>> {
    const post = await this.communityPostsRepository.findByPostId(postId);
    if (post === null) {
      throw new AppException(COMMUNITY_POSTS_ERRORS.NOT_FOUND);
    }
    if (post.deletedAt !== null) {
      throw new AppException(COMMUNITY_POSTS_ERRORS.ALREADY_DELETED);
    }

    const comment = await this.communityPostsRepository.findComment(commentId);

    if (comment === null) {
      throw new AppException(COMMENTS_ERRORS.NOT_FOUND);
    }

    if (comment.deletedAt !== null) {
      throw new AppException(COMMENTS_ERRORS.ALREADY_DELETED);
    }

    if (comment.userId !== userId) {
      throw new AppException(COMMENTS_ERRORS.FORBIDDEN);
    }

    const toBeDeleted =
      await this.communityPostsRepository.deleteComment(commentId);
    return mapCommentToBeDeleted(toBeDeleted);
  }

  async getPopularPosts(): Promise<PostListItemResponseDto[]> {
    const POOL_SIZE = 20;
    const PICK = 4;
    const pool =
      await this.communityPostsRepository.findPopularPostsPool(POOL_SIZE);
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, PICK).map((post) => mapPostListItem(post));
  }
}
