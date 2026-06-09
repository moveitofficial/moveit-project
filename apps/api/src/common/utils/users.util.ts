import { Role } from '@prisma/client';

import type { PostListItem } from '../../community-posts/community-posts.types';

export function resolveAuthorDisplayName(user: PostListItem['user']): string {
  if (user.role === Role.EXPERT) {
    return user.expertProfile?.businessName ?? '';
  }
  return user.clientProfile?.nickname ?? user.name ?? '';
}
