import type { ServiceCategoryName, ServiceGroupName } from '@prisma/client';

export interface CategoryInput {
  group: ServiceGroupName;
  category: ServiceCategoryName;
}
