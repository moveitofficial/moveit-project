import type { FavoriteExpertListItemResponseDto } from './dto/favorite-expert-list-item-response.dto';
import type { ExpertReviewStats, FavoriteExpertUser } from './favorites.types';

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
