import { Injectable } from '@nestjs/common';
import { Role, ServiceStatus } from '@prisma/client';

import {
  EXPERT_PROFILE_ERRORS,
  FAVORITES_ERRORS,
  SERVICE_ERRORS,
  USER_ERRORS,
} from '../common/constants/errors';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { AppException } from '../common/exceptions/app.exception';
import { Paginated } from '../common/types/paginated.type';
import { toPaginatedResponse } from '../common/utils/list-response.util';
import { mapServiceListItem } from '../services/services.mapper';
import { ServicesRepository } from '../services/services.repository';
import { UsersRepository } from '../users/users.repository';

import { mapFavoriteExpertListItem } from './favorites.mapper';
import { FavoritesRepository } from './favorites.repository';

import type { FavoriteExpertListItemResponseDto } from './dto/favorite-expert-list-item-response.dto';
import type { ServiceListItemResponse } from '../services/services.mapper';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly favoritesRepository: FavoritesRepository,
    private readonly servicesRepository: ServicesRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async getFavoriteServices(
    clientUserId: string,
    query: PaginationQueryDto,
  ): Promise<Paginated<ServiceListItemResponse>> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const skip = (page - 1) * pageSize;

    const [rows, totalCount] = await Promise.all([
      this.favoritesRepository.findFavoriteServices({
        clientUserId,
        skip,
        take: pageSize,
      }),
      this.favoritesRepository.countFavoriteServices(clientUserId),
    ]);

    const services = rows.map((row) => row.service);
    const statsMap = await this.servicesRepository.getReviewStatsByServiceIds(
      services.map((service) => service.id),
    );

    return toPaginatedResponse(
      services.map((service) =>
        mapServiceListItem(
          service,
          statsMap.get(service.id) ?? { rating: 0, reviewCount: 0 },
        ),
      ),
      { page, pageSize, totalCount },
    );
  }

  async getFavoriteExperts(
    clientUserId: string,
    query: PaginationQueryDto,
  ): Promise<Paginated<FavoriteExpertListItemResponseDto>> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const skip = (page - 1) * pageSize;

    const [rows, totalCount] = await Promise.all([
      this.favoritesRepository.findFavoriteExperts({
        clientUserId,
        skip,
        take: pageSize,
      }),
      this.favoritesRepository.countFavoriteExperts(clientUserId),
    ]);

    const experts = rows.map((row) => row.expertUser);
    const statsMap =
      await this.favoritesRepository.getReviewStatsByExpertUserIds(
        experts.map((expert) => expert.id),
      );

    return toPaginatedResponse(
      experts.map((expert) =>
        mapFavoriteExpertListItem(
          expert,
          statsMap.get(expert.id) ?? { rating: 0, reviewCount: 0 },
        ),
      ),
      { page, pageSize, totalCount },
    );
  }

  async addFavoriteService(
    clientUserId: string,
    serviceId: string,
  ): Promise<object> {
    const service = await this.servicesRepository.findById(serviceId);

    if (service === null) {
      throw new AppException(SERVICE_ERRORS.NOT_FOUND);
    }

    if (service.status !== ServiceStatus.ACTIVE) {
      throw new AppException(SERVICE_ERRORS.NOT_AVAILABLE);
    }

    const isFavorite = await this.favoritesRepository.isFavoriteService(
      clientUserId,
      serviceId,
    );

    if (isFavorite) {
      throw new AppException(FAVORITES_ERRORS.ALREADY_FAVORITED);
    }

    await this.favoritesRepository.addFavoriteService(clientUserId, serviceId);
    return {};
  }

  async removeFavoriteService(
    clientUserId: string,
    serviceId: string,
  ): Promise<object> {
    const deleted = await this.favoritesRepository.removeFavoriteService(
      clientUserId,
      serviceId,
    );

    if (!deleted) {
      throw new AppException(FAVORITES_ERRORS.NOT_FOUND);
    }

    return {};
  }

  async addFavoriteExpert(
    clientUserId: string,
    expertUserId: string,
  ): Promise<object> {
    await this.assertFavoriteableExpert(expertUserId);

    const isFavorite = await this.favoritesRepository.isFavoriteExpert(
      clientUserId,
      expertUserId,
    );

    if (isFavorite) {
      throw new AppException(FAVORITES_ERRORS.ALREADY_FAVORITED);
    }

    await this.favoritesRepository.addFavoriteExpert(
      clientUserId,
      expertUserId,
    );
    return {};
  }

  async removeFavoriteExpert(
    clientUserId: string,
    expertUserId: string,
  ): Promise<object> {
    const deleted = await this.favoritesRepository.removeFavoriteExpert(
      clientUserId,
      expertUserId,
    );

    if (!deleted) {
      throw new AppException(FAVORITES_ERRORS.NOT_FOUND);
    }

    return {};
  }

  private async assertFavoriteableExpert(expertUserId: string): Promise<void> {
    const expert =
      await this.usersRepository.findByIdWithProfiles(expertUserId);

    if (expert === null) {
      throw new AppException(USER_ERRORS.NOT_FOUND);
    }

    if (expert.role !== Role.EXPERT) {
      throw new AppException(USER_ERRORS.NOT_FOUND);
    }

    if (expert.expertProfile === null) {
      throw new AppException(EXPERT_PROFILE_ERRORS.NOT_FOUND);
    }
  }
}
