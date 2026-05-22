import { mapServiceCategoryRef } from '../common/utils/service-category.util';

import type { ServiceResponse, ServiceWithRelations } from './services.types';

export function mapService(service: ServiceWithRelations): ServiceResponse {
  const {
    serviceGroup,
    serviceCategory,
    serviceGroupId: _serviceGroupId,
    serviceCategoryId: _serviceCategoryId,
    ...rest
  } = service;
  return {
    ...rest,
    categoryRef: mapServiceCategoryRef({ serviceGroup, serviceCategory }),
  };
}
