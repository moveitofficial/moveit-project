import { Role } from '@prisma/client';

import type { PostListItem } from './community-posts.types';
import type { CommunityPost } from '@prisma/client';

function resolveAuthorDisplayName(user: PostListItem['user']): string {
  if (user.role === Role.EXPERT) {
    return user.expertProfile?.businessName ?? '';
  }
  return user.clientProfile?.nickname ?? user.name ?? '';
}

export function mapPostListItem(post: PostListItem) {
  return {
    id: post.id,
    userId: post.userId,
    category: post.category,
    title: post.title,
    content: post.content,
    createdAt: post.createdAt,
    authorDisplayName: resolveAuthorDisplayName(post.user),
    commentCount: post._count.comments,
    likeCount: post._count.likeRecords,
  };
}

export function mapPost(post: CommunityPost) {
  return {
    id: post.id,
    userId: post.userId,
    category: post.category,
    title: post.title,
    content: post.content,
    createdAt: post.createdAt,
  };
}

export function mapPostDetail(post: PostListItem, isLiked: boolean) {
  return {
    ...mapPostListItem(post),
    isLiked,
  };
}

export function mapPostToBeDeleted(post: CommunityPost) {
  return {
    ...mapPost(post),
    deletedAt: post.deletedAt,
  };
}
