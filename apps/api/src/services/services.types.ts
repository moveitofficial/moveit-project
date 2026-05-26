import type {
  Prisma,
  ServiceCategoryName,
  ServiceGroupName,
} from '@prisma/client';

/** CRUD · 상세 */
export const serviceInclude = {
  images: {
    select: { id: true, imgUrl: true, isMain: true },
  },
  steps: {
    select: { id: true, order: true, title: true, description: true },
  },
  faqs: {
    select: { id: true, question: true, answer: true },
  },
  techStacks: {
    select: { techStackId: true },
  },
  serviceGroup: {
    select: { name: true },
  },
  serviceCategory: {
    select: { name: true },
  },
} satisfies Prisma.ServiceInclude;

export type ServiceWithRelations = Prisma.ServiceGetPayload<{
  include: typeof serviceInclude;
}>;

export type ServiceResponse = Omit<
  ServiceWithRelations,
  'serviceGroup' | 'serviceCategory' | 'serviceGroupId' | 'serviceCategoryId'
> & {
  categoryRef: {
    group: ServiceGroupName;
    category: ServiceCategoryName;
  };
};

/** GET /services 목록 조회 */
export const serviceListInclude = {
  images: {
    where: { isMain: true },
    take: 1,
    select: { imgUrl: true },
  },
  serviceGroup: { select: { name: true } },
  serviceCategory: { select: { name: true } },
  expertUser: {
    select: {
      id: true,
      name: true,
      profileImageUrl: true,
      region: true,
      expertProfile: { select: { businessName: true } },
    },
  },
  techStacks: {
    select: { techStack: { select: { name: true } } },
  },
  _count: {
    select: {
      orders: true,
      favoriteServices: true,
    },
  },
} satisfies Prisma.ServiceInclude;

export type ServiceListItem = Prisma.ServiceGetPayload<{
  include: typeof serviceListInclude;
}>;

export interface ServiceReviewStats {
  reviewCount: number;
  rating: number;
}

/** GET /services/:id 상세 조회 */
export const serviceDetailInclude = {
  images: {
    select: { id: true, imgUrl: true, isMain: true },
    orderBy: { isMain: 'desc' as const },
  },
  steps: {
    select: { order: true, title: true, description: true },
    orderBy: { order: 'asc' as const },
  },
  faqs: {
    select: { id: true, question: true, answer: true },
  },
  techStacks: {
    select: { techStack: { select: { name: true } } },
  },
  serviceGroup: { select: { name: true } },
  serviceCategory: { select: { name: true } },
  expertUser: {
    select: {
      id: true,
      name: true,
      profileImageUrl: true,
      region: true,
      expertProfile: { select: { businessName: true } },
    },
  },
  _count: {
    select: {
      orders: true,
      favoriteServices: true,
    },
  },
} satisfies Prisma.ServiceInclude;

export type ServiceDetail = Prisma.ServiceGetPayload<{
  include: typeof serviceDetailInclude;
}>;

export const reviewWithUserSelect = {
  id: true,
  rating: true,
  content: true,
  createdAt: true,
  user: {
    select: { id: true, name: true, profileImageUrl: true },
  },
} satisfies Prisma.ReviewSelect;

export type ReviewWithUser = Prisma.ReviewGetPayload<{
  select: typeof reviewWithUserSelect;
}>;
