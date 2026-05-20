import type { Prisma } from '@prisma/client';

export const portfolioInclude = {
  images: true,
  skills: true,
} satisfies Prisma.PortfolioInclude;

export type PortfolioWithRelations = Prisma.PortfolioGetPayload<{
  include: typeof portfolioInclude;
}>;
