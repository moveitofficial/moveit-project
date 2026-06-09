import type { FavoriteExpertListItemResponseDto } from './dto/favorite-expert-list-item-response.dto';
import type { FavoriteExpertUser, ExpertReviewStats } from './favorites.types';

export function mapFavoriteExpertListItem(
  expert: FavoriteExpertUser,
  stats: ExpertReviewStats,
): FavoriteExpertListItemResponseDto {
  return {
    id: expert.id,
    name: expert.name ?? '',
    companyName: expert.expertProfile?.businessName ?? expert.name ?? '',
    profileImageUrl: expert.profileImageUrl,
    techStacks:
      expert.expertProfile?.techStacks.map(({ techStack }) => techStack.name) ??
      [],
    rating: stats.rating,
    reviewCount: stats.reviewCount,
  };
}
