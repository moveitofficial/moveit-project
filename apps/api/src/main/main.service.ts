import { Injectable } from '@nestjs/common';
import { MainSectionType } from '@prisma/client';

import { mapServiceListItem } from '../services/services.mapper';

import { MainRepository } from './main.repository';

import type {
  MainExpertItemDto,
  MainSectionsResponseDto,
} from './dto/main-sections-response.dto';

@Injectable()
export class MainService {
  constructor(private readonly mainRepository: MainRepository) {}

  async getSections(): Promise<MainSectionsResponseDto> {
    const [serviceRows, expertRows, banner] = await Promise.all([
      this.mainRepository.findServiceSettings(),
      this.mainRepository.findExpertSettings(),
      this.mainRepository.findLatestBanner(),
    ]);

    const services = serviceRows
      .map((row) => row.targetService)
      .filter((s): s is NonNullable<typeof s> => s !== null);

    const statsMap = await this.mainRepository.getReviewStatsByServiceIds(
      services.map((s) => s.id),
    );

    const response: MainSectionsResponseDto = {
      popularItCoaching: [],
      banner,
      popularProjectRequest: [],
      moveitPopularProjectExpert: [],
      moveitPopularCoaching: [],
      recommendedItCoaching: [],
      recommendedProjectRequest: [],
    };

    for (const row of serviceRows) {
      const service = row.targetService;
      if (service === null) continue;

      const stats = statsMap.get(service.id) ?? { reviewCount: 0, rating: 0 };
      const item = mapServiceListItem(service, stats);

      switch (row.sectionType) {
        case MainSectionType.POPULAR_IT_COACHING: {
          response.popularItCoaching.push(item);
          break;
        }
        case MainSectionType.POPULAR_PROJECT_REQUEST: {
          response.popularProjectRequest.push(item);
          break;
        }
        case MainSectionType.RECOMMENDED_IT_COACHING: {
          response.recommendedItCoaching.push(item);
          break;
        }
        case MainSectionType.RECOMMENDED_PROJECT_REQUEST: {
          response.recommendedProjectRequest.push(item);
          break;
        }
      }
    }

    for (const row of expertRows) {
      const user = row.targetUser;
      if (user === null) continue;

      const profile = user.expertProfile;

      const item: MainExpertItemDto = {
        userId: user.id,
        name: user.name,
        businessName: profile?.businessName ?? null,
        profileImageUrl: user.profileImageUrl,
        region: user.region,
        rating: profile?.avgRating ?? 0,
        reviewCount: profile?.reviewCount ?? 0,
        techStacks:
          profile?.techStacks.map(({ techStack }) => techStack.name) ?? [],
        specialty: profile?.specialtyCategories[0]?.serviceGroup.name ?? null,
      };

      switch (row.sectionType) {
        case MainSectionType.MOVEIT_POPULAR_COACHING: {
          response.moveitPopularCoaching.push(item);
          break;
        }
        case MainSectionType.MOVEIT_POPULAR_PROJECT_EXPERT: {
          response.moveitPopularProjectExpert.push(item);
          break;
        }
      }
    }

    return response;
  }
}
