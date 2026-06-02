import type { Prisma } from '@prisma/client';

export const postListSelect = {
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

export const postDetailSelect = {
  ...postListSelect,
  deletedAt: true,
} satisfies Prisma.CommunityPostSelect;

export type PostListItem = Prisma.CommunityPostGetPayload<{
  select: typeof postListSelect;
}>;

export type PostDetailItem = Prisma.CommunityPostGetPayload<{
  select: typeof postDetailSelect;
}>;

export const commentListSelect = {
  id: true,
  userId: true,
  content: true,
  createdAt: true,
  user: {
    select: {
      id: true,
      role: true,
      name: true,
      profileImageUrl: true,
      clientProfile: { select: { nickname: true } },
      expertProfile: { select: { businessName: true } },
    },
  },
} satisfies Prisma.CommentSelect;

export type CommentListItem = Prisma.CommentGetPayload<{
  select: typeof commentListSelect;
}>;
