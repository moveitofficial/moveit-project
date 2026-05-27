import type { Prisma } from '@prisma/client';

export const expertProfileInclude = {
  specialtyCategories: {
    include: {
      serviceGroup: { select: { name: true } },
      serviceCategory: { select: { name: true } },
    },
  },
  techStacks: {
    include: {
      techStack: { select: { name: true } },
    },
  },
  portfolios: true,
} satisfies Prisma.ExpertProfileInclude;

export type ExpertProfileWithRelations = Prisma.ExpertProfileGetPayload<{
  include: typeof expertProfileInclude;
}>;
