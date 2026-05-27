import type { ServiceCategoryName, ServiceGroupName } from '@prisma/client';

export function mapServiceCategoryRef({
  serviceGroup,
  serviceCategory,
}: {
  serviceGroup: { name: ServiceGroupName };
  serviceCategory: { name: ServiceCategoryName };
}) {
  return {
    group: serviceGroup.name,
    category: serviceCategory.name,
  };
}

export function mapServiceCategories(
  categories: {
    serviceGroup: { name: ServiceGroupName };
    serviceCategory: { name: ServiceCategoryName };
  }[],
) {
  return categories.map((category) => mapServiceCategoryRef(category));
}
