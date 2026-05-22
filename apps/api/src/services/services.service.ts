import { Injectable } from '@nestjs/common';
import { ServiceStatus, type Prisma } from '@prisma/client';

import { COMMON_ERRORS, SERVICE_ERRORS } from '../common/constants/errors';
import { AppException } from '../common/exceptions/app.exception';
import { toListResponse } from '../common/utils/list-response.util';

import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { UpdateServiceStatusRequestDto } from './dto/update-service-status-request.dto';
import { mapService } from './services.mapper';
import { ServicesRepository } from './services.repository';

import type { ServiceResponse } from './services.types';

@Injectable()
export class ServicesService {
  constructor(private readonly servicesRepository: ServicesRepository) {}

  getServices(): Promise<{ count: number; items: ServiceResponse[] }> {
    return this.servicesRepository
      .findMany()
      .then((items) => toListResponse(items.map((item) => mapService(item))));
  }

  async getServiceById(serviceId: string): Promise<ServiceResponse> {
    const service = await this.servicesRepository.findById(serviceId);
    if (!service) {
      throw new AppException(SERVICE_ERRORS.NOT_FOUND);
    }
    return mapService(service);
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
      preparationNotes: dto.preparationNotes ?? null,
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
      throw new AppException(COMMON_ERRORS.VALIDATION_ERROR);
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
