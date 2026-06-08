import { Injectable } from '@nestjs/common';
import { MainSectionType } from '@prisma/client';

import { AdminMainSettingRepository } from './admin-main-setting.repository';

import type {
  ExpertMainItemDto,
  MainSettingResponseDto,
  ServiceMainItemDto,
} from './dto/main-setting-response.dto';

@Injectable()
export class AdminMainSettingService {
  constructor(
    private readonly adminMainSettingRepository: AdminMainSettingRepository,
  ) {}

  async getMainSettings(): Promise<MainSettingResponseDto> {
    const [serviceRows, expertRows, banners] = await Promise.all([
      this.adminMainSettingRepository.findServiceSettings(),
      this.adminMainSettingRepository.findExpertSettings(),
      this.adminMainSettingRepository.findBanners(),
    ]);

    const response: MainSettingResponseDto = {
      popularItCoaching: [],
      banners,
      popularProjectRequest: [],
      recommendedItCoaching: [],
      recommendedProjectRequest: [],
      moveitPopularProjectExpert: [],
      moveitPopularCoaching: [],
    };

    for (const row of serviceRows) {
      const service = row.targetService;
      if (service === null) continue;

      const item: ServiceMainItemDto = {
        mainSettingId: row.id,
        serviceId: service.id,
        title: service.title,
        category: service.serviceGroup.name,
        businessName: service.expertUser.expertProfile?.businessName ?? null,
        status: service.status,
        servicePrice: service.servicePrice,
        createdAt: service.createdAt,
        orderCount: service._count.orders,
      };

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

      const specialtySet = new Set(
        user.expertProfile?.specialtyCategories.map(
          (c) => c.serviceGroup.name,
        ) ?? [],
      );

      const item: ExpertMainItemDto = {
        mainSettingId: row.id,
        userId: user.id,
        businessName: user.expertProfile?.businessName ?? null,
        email: user.email,
        specialties: [...specialtySet],
        provider: user.provider,
        isApproved: user.expertProfile?.isApproved ?? false,
        region: user.region,
        saleCount: user._count.ordersAsExpert,
        reportCount: user._count.receivedReports,
        createdAt: user.createdAt,
      };

      switch (row.sectionType) {
        case MainSectionType.MOVEIT_POPULAR_PROJECT_EXPERT: {
          response.moveitPopularProjectExpert.push(item);
          break;
        }
        case MainSectionType.MOVEIT_POPULAR_COACHING: {
          response.moveitPopularCoaching.push(item);
          break;
        }
      }
    }

    return response;
  }
}
