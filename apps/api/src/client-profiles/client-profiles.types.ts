import type { Prisma } from '@prisma/client';

export const clientProfileInclude = {
  interestCategories: {
    include: {
      serviceGroup: { select: { name: true } },
      serviceCategory: { select: { name: true } },
    },
  },
} satisfies Prisma.ClientProfileInclude;

export type ClientProfileWithCategories = Prisma.ClientProfileGetPayload<{
  include: typeof clientProfileInclude;
}>;
