import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminCommunityRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ── 게시글 ───────────────────────────────────────────────
  findPostById(postId: string) {
    return this.prisma.communityPost.findUnique({
      where: { id: postId },
      select: {
        id: true,
        title: true,
        userId: true,
        deletedAt: true,
      },
    });
  }

  softDeletePost(postId: string, adminId: string, deleteReason: string) {
    return this.prisma.communityPost.update({
      where: { id: postId },
      data: {
        deletedAt: new Date(),
        deletedByAdminId: adminId,
        deleteReason,
      },
    });
  }

  findPostDeletionById(postId: string) {
    return this.prisma.communityPost.findUnique({
      where: { id: postId },
      select: {
        deletedAt: true,
        deleteReason: true,
        deletedByAdmin: { select: { name: true } },
      },
    });
  }

  // ── 댓글 ─────────────────────────────────────────────────
  findCommentById(commentId: string) {
    return this.prisma.comment.findUnique({
      where: { id: commentId },
      select: {
        id: true,
        userId: true,
        deletedAt: true,
        post: { select: { title: true } },
      },
    });
  }

  softDeleteComment(commentId: string, adminId: string, deleteReason: string) {
    return this.prisma.comment.update({
      where: { id: commentId },
      data: {
        deletedAt: new Date(),
        deletedByAdminId: adminId,
        deleteReason,
      },
    });
  }

  findCommentDeletionById(commentId: string) {
    return this.prisma.comment.findUnique({
      where: { id: commentId },
      select: {
        deletedAt: true,
        deleteReason: true,
        deletedByAdmin: { select: { name: true } },
      },
    });
  }
}
