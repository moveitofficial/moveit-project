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
