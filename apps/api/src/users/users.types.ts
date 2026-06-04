import { clientProfileInclude } from '../client-profiles/client-profiles.types';
import { expertProfileInclude } from '../expert-profiles/expert-profiles.types';

import type { Prisma } from '@prisma/client';

export const userWithProfilesInclude = {
  clientProfile: { include: clientProfileInclude },
  expertProfile: { include: expertProfileInclude },
} satisfies Prisma.UserInclude;

export type UserWithProfiles = Prisma.UserGetPayload<{
  include: typeof userWithProfilesInclude;
}>;

export const myPostListSelect = {
  id: true,
  userId: true,
  category: true,
  title: true,
  content: true,
  createdAt: true,
  user: {
    select: {
      id: true,
      role: true,
      name: true,
      clientProfile: { select: { nickname: true } },
      expertProfile: { select: { businessName: true } },
    },
  },
  _count: {
    select: {
      comments: { where: { deletedAt: null } },
      likeRecords: true,
    },
  },
} satisfies Prisma.CommunityPostSelect;

export type MyPostListItem = Prisma.CommunityPostGetPayload<{
  select: typeof myPostListSelect;
export const myCommentListSelect = {
  id: true,
  content: true,
  createdAt: true,
  post: {
    select: {
      id: true,
      category: true,
      title: true,
      deletedAt: true,
      _count: {
        select: {
          likeRecords: true,
        },
      },
    },
  },
} satisfies Prisma.CommentSelect;
export type MyCommentListItem = Prisma.CommentGetPayload<{
  select: typeof myCommentListSelect;
}>;
