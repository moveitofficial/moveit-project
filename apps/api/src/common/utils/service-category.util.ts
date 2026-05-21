import type { ServiceCategoryName, ServiceGroupName } from '@prisma/client';

export function mapServiceCategories(
  categories: {
    serviceGroup: { name: ServiceGroupName };
    serviceCategory: { name: ServiceCategoryName };
  }[],
) {
  return categories.map((c) => ({
    group: c.serviceGroup.name,
    category: c.serviceCategory.name,
  }));
}
