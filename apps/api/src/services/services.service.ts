import { Injectable } from '@nestjs/common';
import { ServiceStatus, type Prisma } from '@prisma/client';

import { SERVICE_ERRORS } from '../common/constants/errors';
import { AppException } from '../common/exceptions/app.exception';
import { toPaginatedResponse } from '../common/utils/list-response.util';

import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { UpdateServiceStatusRequestDto } from './dto/update-service-status-request.dto';
import {
  mapService,
  mapServiceDetail,
  mapServiceListItem,
  type ServiceDetailResponse,
  type ServiceListItemResponse,
} from './services.mapper';
import { ServicesRepository } from './services.repository';

import type {
  ServiceListQueryDto,
  ServiceListSort,
} from './dto/service-response.dto';
import type {
  ServiceListItem,
  ServiceReviewStats,
  ServiceResponse,
} from './services.types';

@Injectable()
export class ServicesService {
  constructor(private readonly servicesRepository: ServicesRepository) {}

  async getServices(query: ServiceListQueryDto) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const sort = query.sort ?? 'popular';
    const where = this.buildListWhere(query);
    const skip = (page - 1) * pageSize;

    if (sort === 'rating') {
      return this.getServicesByRatingSort(where, page, pageSize, skip);
    }

    const orderBy = this.buildListOrderBy(sort);
    const [services, totalCount] = await Promise.all([
      this.servicesRepository.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
      }),
      this.servicesRepository.count(where),
    ]);

    const statsMap = await this.servicesRepository.getReviewStatsByServiceIds(
      services.map((service) => service.id),
    );

    return toPaginatedResponse(this.toListItems(services, statsMap), {
      page,
      pageSize,
      totalCount,
    });
  }

  private async getServicesByRatingSort(
    where: Prisma.ServiceWhereInput,
    page: number,
    pageSize: number,
    skip: number,
  ) {
    const [idMatches, totalCount] = await Promise.all([
      this.servicesRepository.findIds(where),
      this.servicesRepository.count(where),
    ]);

    const ids = idMatches.map((match) => match.id);
    const statsMap =
      await this.servicesRepository.getReviewStatsByServiceIds(ids);

    const sortedIds = [...ids].sort(
      (a, b) => (statsMap.get(b)?.rating ?? 0) - (statsMap.get(a)?.rating ?? 0),
    );

    const pageIds = sortedIds.slice(skip, skip + pageSize);
    const services = await this.servicesRepository.findManyByIds(pageIds);

    return toPaginatedResponse(
      this.toListItems(this.orderByIds(services, pageIds), statsMap),
      { page, pageSize, totalCount },
    );
  }

  private toListItems(
    services: ServiceListItem[],
    statsMap: Map<string, ServiceReviewStats>,
  ): ServiceListItemResponse[] {
    return services.map((service) => {
      const stats = statsMap.get(service.id) ?? { reviewCount: 0, rating: 0 };
      return mapServiceListItem(service, stats);
    });
  }

  private orderByIds<T extends { id: string }>(items: T[], ids: string[]): T[] {
    const byId = new Map(items.map((item) => [item.id, item]));
    return ids
      .map((id) => byId.get(id))
      .filter((item): item is T => item !== undefined);
  }

  private buildListWhere(query: ServiceListQueryDto): Prisma.ServiceWhereInput {
    const price: Prisma.IntFilter | undefined =
      query.priceMin !== undefined || query.priceMax !== undefined
        ? {
            ...(query.priceMin === undefined ? {} : { gte: query.priceMin }),
            ...(query.priceMax === undefined ? {} : { lte: query.priceMax }),
          }
        : undefined;

    return {
      status: ServiceStatus.ACTIVE,
      ...(query.group ? { serviceGroup: { name: query.group } } : {}),
      ...(query.category ? { serviceCategory: { name: query.category } } : {}),
      ...(query.region ? { expertUser: { region: query.region } } : {}),
      ...(price ? { servicePrice: price } : {}),
      ...(query.techStacks?.length
        ? {
            techStacks: {
              some: { techStack: { name: { in: query.techStacks } } },
            },
          }
        : {}),
    };
  }

  private buildListOrderBy(
    sort: Exclude<ServiceListSort, 'rating'>,
  ):
    | Prisma.ServiceOrderByWithRelationInput
    | Prisma.ServiceOrderByWithRelationInput[] {
    switch (sort) {
      case 'price_asc': {
        return { servicePrice: 'asc' };
      }
      case 'price_desc': {
        return { servicePrice: 'desc' };
      }
      case 'popular': {
        return { orders: { _count: 'desc' } };
      }
      case 'latest': {
        return { createdAt: 'desc' };
      }
      default: {
        const _exhaustive: never = sort;
        return _exhaustive;
      }
    }
  }

  async getServiceById(serviceId: string): Promise<ServiceDetailResponse> {
    const service = await this.servicesRepository.findDetailById(serviceId);
    if (!service) {
      throw new AppException(SERVICE_ERRORS.NOT_FOUND);
    }

    const [reviewPreview, statsMap] = await Promise.all([
      this.servicesRepository.findReviewsPreview(serviceId, 4),
      this.servicesRepository.getReviewStatsByServiceIds([serviceId]),
    ]);

    const stats = statsMap.get(serviceId) ?? { reviewCount: 0, rating: 0 };

    return mapServiceDetail(service, {
      items: reviewPreview,
      totalCount: stats.reviewCount,
      averageRating: stats.rating,
    });
  }

  async createService(
    expertUserId: string,
    dto: CreateServiceRequestDto,
  ): Promise<ServiceResponse> {
    const service = await this.servicesRepository.create({
      expertUserId,
      title: dto.title,
      workDuration: dto.workDuration,
      revisionCount: dto.revisionCount,
      serviceScope: dto.serviceScope,
      servicePrice: dto.servicePrice,
      description: dto.description,
      preparationNotes: dto.preparationNotes,
      refundPolicy: dto.refundPolicy,
      status: ServiceStatus.ACTIVE,
      serviceGroupId: dto.serviceGroupId,
      serviceCategoryId: dto.serviceCategoryId,
      images: {
        create: [
          { imgUrl: dto.mainImageUrl, isMain: true },
          ...dto.images.map((i) => ({ imgUrl: i.imgUrl, isMain: false })),
        ],
      },
      steps: {
        create: dto.steps.map((s, idx) => ({
          title: s.title,
          description: s.description,
          order: idx + 1,
        })),
      },
      faqs: {
        create: dto.faqs.map((f) => ({
          question: f.question,
          answer: f.answer,
        })),
      },
      techStacks: {
        create: dto.techStackIds.map((id) => ({ techStackId: id })),
      },
    });
    return mapService(service);
  }

  async updateService(
    expertUserId: string,
    serviceId: string,
    dto: UpdateServiceRequestDto,
  ): Promise<ServiceResponse> {
    const existing = await this.servicesRepository.findById(serviceId);
    if (!existing) {
      throw new AppException(SERVICE_ERRORS.NOT_FOUND);
    }
    if (existing.expertUserId !== expertUserId) {
      throw new AppException(SERVICE_ERRORS.FORBIDDEN_NOT_OWNER);
    }
    if (existing.status === ServiceStatus.CLOSED) {
      throw new AppException(SERVICE_ERRORS.ALREADY_DELETED);
    }

    const isPartialImages =
      (dto.mainImageUrl !== undefined) !== (dto.images !== undefined);
    if (isPartialImages) {
      throw new AppException(SERVICE_ERRORS.IMAGE_PARTIAL_UPDATE);
    }

    const data: Prisma.ServiceUncheckedUpdateInput = {};

    if (dto.title !== undefined) data.title = dto.title;
    if (dto.workDuration !== undefined) data.workDuration = dto.workDuration;
    if (dto.revisionCount !== undefined) data.revisionCount = dto.revisionCount;
    if (dto.serviceScope !== undefined) data.serviceScope = dto.serviceScope;
    if (dto.servicePrice !== undefined) data.servicePrice = dto.servicePrice;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.preparationNotes !== undefined) {
      data.preparationNotes = dto.preparationNotes;
    }
    if (dto.refundPolicy !== undefined) data.refundPolicy = dto.refundPolicy;
    if (dto.serviceGroupId !== undefined) {
      data.serviceGroupId = dto.serviceGroupId;
    }
    if (dto.serviceCategoryId !== undefined) {
      data.serviceCategoryId = dto.serviceCategoryId;
    }
    if (dto.mainImageUrl !== undefined && dto.images !== undefined) {
      data.images = {
        deleteMany: {},
        create: [
          { imgUrl: dto.mainImageUrl, isMain: true },
          ...dto.images.map((i) => ({ imgUrl: i.imgUrl, isMain: false })),
        ],
      };
    }
    if (dto.steps !== undefined) {
      data.steps = {
        deleteMany: {},
        create: dto.steps.map((s, idx) => ({
          title: s.title,
          description: s.description,
          order: idx + 1,
        })),
      };
    }
    if (dto.faqs !== undefined) {
      data.faqs = {
        deleteMany: {},
        create: dto.faqs.map((f) => ({
          question: f.question,
          answer: f.answer,
        })),
      };
    }
    if (dto.techStackIds !== undefined) {
      data.techStacks = {
        deleteMany: {},
        create: dto.techStackIds.map((id) => ({ techStackId: id })),
      };
    }

    if (Object.keys(data).length === 0) {
      return mapService(existing);
    }

    const updated = await this.servicesRepository.update(serviceId, data);
    return mapService(updated);
  }

  async updateServiceStatus(
    expertUserId: string,
    serviceId: string,
    dto: UpdateServiceStatusRequestDto,
  ): Promise<ServiceResponse> {
    const existing = await this.servicesRepository.findById(serviceId);
    if (!existing) {
      throw new AppException(SERVICE_ERRORS.NOT_FOUND);
    }
    if (existing.expertUserId !== expertUserId) {
      throw new AppException(SERVICE_ERRORS.FORBIDDEN_NOT_OWNER);
    }
    if (existing.status === ServiceStatus.CLOSED) {
      throw new AppException(SERVICE_ERRORS.ALREADY_DELETED);
    }

    const updated = await this.servicesRepository.update(serviceId, {
      status: dto.status,
    });
    return mapService(updated);
  }

  async closeService(
    expertUserId: string,
    serviceId: string,
  ): Promise<ServiceResponse> {
    const existing = await this.servicesRepository.findById(serviceId);
    if (!existing) {
      throw new AppException(SERVICE_ERRORS.NOT_FOUND);
    }
    if (existing.expertUserId !== expertUserId) {
      throw new AppException(SERVICE_ERRORS.FORBIDDEN_NOT_OWNER);
    }
    if (existing.status === ServiceStatus.CLOSED) {
      throw new AppException(SERVICE_ERRORS.ALREADY_DELETED);
    }

    const updated = await this.servicesRepository.update(serviceId, {
      status: ServiceStatus.CLOSED,
    });
    return mapService(updated);
  }
}
