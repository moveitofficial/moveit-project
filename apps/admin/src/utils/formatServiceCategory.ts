import type { ServiceCategory, ServiceType } from '@/types/enums';

import {
  SERVICE_CATEGORY_LABEL,
  SERVICE_TYPE_LABEL,
} from '@/utils/constants/filterConstants';

export function formatServiceCategory(
  categoryGroup: ServiceType,
  categoryName: ServiceCategory,
): string {
  return `${SERVICE_TYPE_LABEL[categoryGroup]} > ${SERVICE_CATEGORY_LABEL[categoryName]}`;
}
