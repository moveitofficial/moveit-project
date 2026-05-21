import type {
  Prisma,
  ServiceCategoryName,
  ServiceGroupName,
} from '@prisma/client';

export const serviceInclude = {
  images: true,
  steps: true,
  faqs: true,
  serviceGroup: { select: { name: true } },
  serviceCategory: { select: { name: true } },
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
