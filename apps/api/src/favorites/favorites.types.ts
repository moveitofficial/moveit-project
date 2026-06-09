import { serviceListInclude } from '../services/services.types';

import type { Prisma } from '@prisma/client';

export const favoriteExpertUserSelect = {
  id: true,
  name: true,
  profileImageUrl: true,
  expertProfile: {
    select: {
      businessName: true,
      techStacks: {
        select: {
          techStack: { select: { name: true } },
        },
      },
    },
  },
} satisfies Prisma.UserSelect;

export type FavoriteExpertUser = Prisma.UserGetPayload<{
  select: typeof favoriteExpertUserSelect;
}>;

export const favoriteServiceInclude = {
  service: {
    include: serviceListInclude,
  },
} satisfies Prisma.FavoriteServiceInclude;

export type FavoriteServiceWithService = Prisma.FavoriteServiceGetPayload<{
  include: typeof favoriteServiceInclude;
}>;

export interface ExpertReviewStats {
  reviewCount: number;
  rating: number;
}
