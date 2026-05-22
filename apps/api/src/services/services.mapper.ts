import { mapServiceCategoryRef } from '../common/utils/service-category.util';

import type {
  ServiceListItem,
  ServiceResponse,
  ServiceReviewStats,
  ServiceWithRelations,
} from './services.types';

export function mapServiceListItem(
  service: ServiceListItem,
  stats: ServiceReviewStats,
) {
  const {
    serviceGroup,
    serviceCategory,
    images,
    expertUser,
    techStacks,
    ...rest
  } = service;

  return {
    id: rest.id,
    title: rest.title,
    servicePrice: rest.servicePrice,
    workDuration: rest.workDuration,
    revisionCount: rest.revisionCount,
    thumbnailUrl: images[0]?.imgUrl ?? '',
    status: rest.status,
    expert: {
      id: expertUser.id,
      name: expertUser.name ?? '',
      companyName:
        expertUser.expertProfile?.businessName ?? expertUser.name ?? '',
      profileImageUrl: expertUser.profileImageUrl,
      region: expertUser.region,
    },
    techStacks: techStacks.map(({ techStack }) => techStack.name),
    categoryRef: mapServiceCategoryRef({ serviceGroup, serviceCategory }),
    rating: stats.rating,
    reviewCount: stats.reviewCount,
    isFavorite: false,
  };
}

export type ServiceListItemResponse = ReturnType<typeof mapServiceListItem>;

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
