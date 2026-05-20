import { Injectable } from '@nestjs/common';
import { Role, ServiceStatus, type Prisma, type Service } from '@prisma/client';

import { SERVICE_ERRORS } from '../common/constants/errors';
import { AppException } from '../common/exceptions/app.exception';
import { toListResponse } from '../common/utils/list-response.util';

import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { UpdateServiceStatusRequestDto } from './dto/update-service-status-request.dto';
import { ServicesRepository } from './services.repository';

@Injectable()
export class ServicesService {
  constructor(private readonly servicesRepository: ServicesRepository) {}

  getServices() {
    return this.servicesRepository.findMany().then(toListResponse);
  }

  async getServiceById(serviceId: string): Promise<Service> {
    const service = await this.servicesRepository.findById(serviceId);
    if (!service) {
      throw new AppException(SERVICE_ERRORS.NOT_FOUND);
    }
    return service;
  }

  async createService(
    expertUserId: string,
    role: Role,
    dto: CreateServiceRequestDto,
  ): Promise<Service> {
    this.ensureExpert(role);

    const status = dto.status ?? ServiceStatus.ACTIVE;

    return this.servicesRepository.create({
      expertUserId,
      title: dto.title,
      workDuration: dto.workDuration,
      revisionCount: dto.revisionCount,
      serviceScope: dto.serviceScope,
      servicePrice: dto.servicePrice,
      description: dto.description,
      preparationNotes: dto.preparationNotes ?? null,
      refundPolicy: dto.refundPolicy,
      status,
      serviceGroupId: dto.serviceGroupId,
      serviceCategoryId: dto.serviceCategoryId,
    });
  }

  async updateService(
    expertUserId: string,
    role: Role,
    serviceId: string,
    dto: UpdateServiceRequestDto,
  ): Promise<Service> {
    this.ensureExpert(role);

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

    if (Object.keys(data).length === 0) {
      return existing;
    }

    return this.servicesRepository.update(serviceId, data);
  }

  async updateServiceStatus(
    expertUserId: string,
    role: Role,
    serviceId: string,
    dto: UpdateServiceStatusRequestDto,
  ): Promise<Service> {
    this.ensureExpert(role);

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

    return this.servicesRepository.update(serviceId, {
      status: dto.status,
    });
  }

  async closeService(
    expertUserId: string,
    role: Role,
    serviceId: string,
  ): Promise<Service> {
    this.ensureExpert(role);

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

    return this.servicesRepository.update(serviceId, {
      status: ServiceStatus.CLOSED,
    });
  }

  private ensureExpert(role: Role): void {
    if (role !== Role.EXPERT) {
      throw new AppException(SERVICE_ERRORS.EXPERT_ROLE_REQUIRED);
    }
  }
}
