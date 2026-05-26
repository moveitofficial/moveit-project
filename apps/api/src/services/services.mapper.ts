import { mapServiceCategoryRef } from '../common/utils/service-category.util';

import type {
  ServiceDetail,
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
    orderCount: service._count.orders,
    favoriteCount: service._count.favoriteServices,
  };
}

export type ServiceListItemResponse = ReturnType<typeof mapServiceListItem>;

export function mapServiceDetail(service: ServiceDetail) {
  const {
    serviceGroup,
    serviceCategory,
    images,
    steps,
    faqs,
    techStacks,
    expertUser,
    serviceGroupId: _serviceGroupId,
    serviceCategoryId: _serviceCategoryId,
    expertUserId: _expertUserId,
    ...rest
  } = service;

  return {
    id: rest.id,
    title: rest.title,
    workDuration: rest.workDuration,
    revisionCount: rest.revisionCount,
    serviceScope: rest.serviceScope,
    servicePrice: rest.servicePrice,
    description: rest.description,
    preparationNotes: rest.preparationNotes,
    refundPolicy: rest.refundPolicy,
    status: rest.status,
    categoryRef: mapServiceCategoryRef({ serviceGroup, serviceCategory }),
    isFavorite: false,
    expert: {
      id: expertUser.id,
      name: expertUser.name ?? '',
      companyName:
        expertUser.expertProfile?.businessName ?? expertUser.name ?? '',
      profileImageUrl: expertUser.profileImageUrl,
      region: expertUser.region,
    },
    images,
    techStacks: techStacks.map(({ techStack }) => techStack.name),
    steps: steps.map(({ order, title, description }) => ({
      order,
      title,
      description,
    })),
    faqs,
    orderCount: service._count.orders,
    favoriteCount: service._count.favoriteServices,
  };
}

export type ServiceDetailResponse = ReturnType<typeof mapServiceDetail>;

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
