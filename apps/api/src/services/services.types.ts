import type {
  Prisma,
  ServiceCategoryName,
  ServiceGroupName,
} from '@prisma/client';

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
