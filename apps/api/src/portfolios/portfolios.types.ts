import type { Prisma } from '@prisma/client';

export const portfolioInclude = {
  images: true,
  skills: true,
} satisfies Prisma.PortfolioInclude;

export type PortfolioWithRelations = Prisma.PortfolioGetPayload<{
  include: typeof portfolioInclude;
}>;

export const PortfolioListInclude = {
  images: {
    where: { isMain: true },
    take: 1,
  },
} satisfies Prisma.PortfolioInclude;

export type PortfolioListItem = Prisma.PortfolioGetPayload<{
  include: typeof PortfolioListInclude;
}>;
