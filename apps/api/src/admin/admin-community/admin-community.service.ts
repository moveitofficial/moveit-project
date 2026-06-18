import { Injectable } from '@nestjs/common';
import { NotificationCategory } from '@prisma/client';

import {
  COMMENTS_ERRORS,
  COMMUNITY_POSTS_ERRORS,
} from '../../common/constants/errors';
import { AppException } from '../../common/exceptions/app.exception';
import { NotificationsService } from '../../notifications/notifications.service';

import { AdminCommunityRepository } from './admin-community.repository';
import { DeletionInfoResponseDto } from './dto/deletion-info-response.dto';

@Injectable()
export class AdminCommunityService {
  constructor(
    private readonly adminCommunityRepository: AdminCommunityRepository,
    private readonly notificationsService: NotificationsService,
  ) {}

  // ── 게시글 삭제 ──────────────────────────────────────────
  async deletePost(
    postId: string,
    adminId: string,
    deleteReason: string,
  ): Promise<void> {
    const post = await this.adminCommunityRepository.findPostById(postId);
    if (!post) throw new AppException(COMMUNITY_POSTS_ERRORS.NOT_FOUND);
    if (post.deletedAt)
      throw new AppException(COMMUNITY_POSTS_ERRORS.ALREADY_DELETED);

    await this.adminCommunityRepository.softDeletePost(
      postId,
      adminId,
      deleteReason,
    );

    await this.notificationsService.send({
      userIds: [post.userId],
      category: NotificationCategory.POST_DELETED_BY_ADMIN,
      vars: { postTitle: post.title, deleteReason },
      referenceId: postId,
    });
  }

  // ── 게시글 삭제 사유 조회 ───────────────────────────────
  async getPostDeletion(postId: string): Promise<DeletionInfoResponseDto> {
    const post =
      await this.adminCommunityRepository.findPostDeletionById(postId);
    if (!post?.deletedAt || !post.deletedByAdmin)
      throw new AppException(COMMUNITY_POSTS_ERRORS.NOT_FOUND);

    return {
      deletedAt: post.deletedAt,
      deletedByAdminName: post.deletedByAdmin.name,
      deleteReason: post.deleteReason ?? '',
    };
  }

  // ── 댓글 삭제 ────────────────────────────────────────────
  async deleteComment(
    commentId: string,
    adminId: string,
    deleteReason: string,
  ): Promise<void> {
    const comment =
      await this.adminCommunityRepository.findCommentById(commentId);
    if (!comment) throw new AppException(COMMENTS_ERRORS.NOT_FOUND);
    if (comment.deletedAt)
      throw new AppException(COMMENTS_ERRORS.ALREADY_DELETED);

    await this.adminCommunityRepository.softDeleteComment(
      commentId,
      adminId,
      deleteReason,
    );

    await this.notificationsService.send({
      userIds: [comment.userId],
      category: NotificationCategory.COMMENT_DELETED_BY_ADMIN,
      vars: { postTitle: comment.post.title, deleteReason },
      referenceId: commentId,
    });
  }

  // ── 댓글 삭제 사유 조회 ─────────────────────────────────
  async getCommentDeletion(
    commentId: string,
  ): Promise<DeletionInfoResponseDto> {
    const comment =
      await this.adminCommunityRepository.findCommentDeletionById(commentId);
    if (!comment?.deletedAt || !comment.deletedByAdmin)
      throw new AppException(COMMENTS_ERRORS.NOT_FOUND);

    return {
      deletedAt: comment.deletedAt,
      deletedByAdminName: comment.deletedByAdmin.name,
      deleteReason: comment.deleteReason ?? '',
    };
  }
}
