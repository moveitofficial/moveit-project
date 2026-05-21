import type { Prisma } from '@prisma/client';

export const serviceInclude = {
  images: true,
  steps: true,
  faqs: true,
} satisfies Prisma.ServiceInclude;

export type ServiceWithRelations = Prisma.ServiceGetPayload<{
  include: typeof serviceInclude;
}>;
