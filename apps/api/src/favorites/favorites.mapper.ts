import { mapServiceCategoryRef } from '../common/utils/service-category.util';

import type { FavoriteExpertListItemResponseDto } from './dto/favorite-expert-list-item-response.dto';
import type { FavoriteServiceListItemResponseDto } from './dto/favorite-service-list-item-response.dto';
import type { ExpertReviewStats, FavoriteExpertUser } from './favorites.types';
import type {
  ServiceListItem,
  ServiceReviewStats,
} from '../services/services.types';

export function mapFavoriteExpertListItem(
  expert: FavoriteExpertUser,
  stats: ExpertReviewStats,
): FavoriteExpertListItemResponseDto {
  const serviceGroups = [
    ...new Set(
      expert.expertProfile?.specialtyCategories.map(
        ({ serviceGroup }) => serviceGroup.name,
      ) ?? [],
    ),
  ];

  return {
    id: expert.id,
    companyName: expert.expertProfile?.businessName ?? '',
    foundedYear: expert.expertProfile?.foundedYear ?? null,
    profileImageUrl: expert.profileImageUrl,
    techStacks:
      expert.expertProfile?.techStacks.map(({ techStack }) => techStack.name) ??
      [],
    serviceGroups,
    rating: stats.rating,
    reviewCount: stats.reviewCount,
  };
}

export function mapFavoriteServiceListItem(
  service: ServiceListItem,
  stats: ServiceReviewStats,
): FavoriteServiceListItemResponseDto {
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
      companyName:
        expertUser.expertProfile?.businessName ?? expertUser.name ?? '',
      profileImageUrl: expertUser.profileImageUrl,
      region: expertUser.region,
    },
    techStacks: techStacks.map(({ techStack }) => techStack.name),
    categoryRef: mapServiceCategoryRef({ serviceGroup, serviceCategory }),
    rating: stats.rating,
    reviewCount: stats.reviewCount,
    orderCount: service._count.orders,
    favoriteCount: service._count.favoriteServices,
  };
}
