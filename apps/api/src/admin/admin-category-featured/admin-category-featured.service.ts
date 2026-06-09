import { Injectable } from '@nestjs/common';
import { ServiceGroupName } from '@prisma/client';

import { CATEGORY_FEATURED_ERRORS } from '../../common/constants/errors';
import { AppException } from '../../common/exceptions/app.exception';
import { toPaginatedResponse } from '../../common/utils/list-response.util';
import {
  RegisteredServiceItemDto,
  ServiceCandidateItemDto,
  ServiceCandidatesResponseDto,
} from '../admin-main-setting/dto/candidates-response.dto';

import { AdminCategoryFeaturedRepository } from './admin-category-featured.repository';

import type { GetCategoryFeaturedCandidatesQueryDto } from './dto/candidates-query.dto';
import type { DeleteCategoryFeaturedDto } from './dto/delete-request.dto';
import type {
  CategoryFeaturedItemDto,
  CategoryFeaturedPageResponseDto,
} from './dto/page-response.dto';
import type { RegisterCategoryFeaturedDto } from './dto/register-request.dto';

const GROUP_LIMIT = 4;
@Injectable()
export class AdminCategoryFeaturedService {
  constructor(
    private readonly adminCategoryFeaturedRepository: AdminCategoryFeaturedRepository,
  ) {}

  async getAll(): Promise<CategoryFeaturedPageResponseDto> {
    const rows = await this.adminCategoryFeaturedRepository.findAll();

    const response: CategoryFeaturedPageResponseDto = {
      itCoaching: [],
      projectRequest: [],
    };

    for (const row of rows) {
      const item: CategoryFeaturedItemDto = {
        categoryFeaturedId: row.id,
        serviceId: row.service.id,
        title: row.service.title,
        category: row.serviceGroup.name,
        businessName:
          row.service.expertUser.expertProfile?.businessName ?? null,
        status: row.service.status,
        servicePrice: row.service.servicePrice,
        createdAt: row.service.createdAt,
        orderCount: row.service._count.orders,
      };

      if (row.serviceGroup.name === ServiceGroupName.IT_COACHING) {
        response.itCoaching.push(item);
      } else {
        response.projectRequest.push(item);
      }
    }

    return response;
  }

  async getCandidates(
    query: GetCategoryFeaturedCandidatesQueryDto,
  ): Promise<ServiceCandidatesResponseDto> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const sort = query.sort ?? 'sales';
    const skip = (page - 1) * pageSize;

    const [rows, totalCount, registeredRows] = await Promise.all([
      this.adminCategoryFeaturedRepository.findCandidates({
        serviceGroup: query.serviceGroup,
        search: query.search,
        sort,
        skip,
        take: pageSize,
      }),
      this.adminCategoryFeaturedRepository.countCandidates({
        serviceGroup: query.serviceGroup,
        search: query.search,
      }),
      this.adminCategoryFeaturedRepository.findRegisteredServicesByGroup(
        query.serviceGroup,
      ),
    ]);

    const registeredSet = new Set(registeredRows.map((r) => r.id));

    const items: ServiceCandidateItemDto[] = rows.map((s) => ({
      serviceId: s.id,
      title: s.title,
      category: s.serviceGroup.name,
      businessName: s.expertUser.expertProfile?.businessName ?? null,
      status: s.status,
      servicePrice: s.servicePrice,
      createdAt: s.createdAt,
      orderCount: s._count.orders,
      isAlreadyRegistered: registeredSet.has(s.id),
    }));

    const registered: RegisteredServiceItemDto[] = registeredRows.map((r) => ({
      serviceId: r.id,
      title: r.title,
    }));

    return {
      ...toPaginatedResponse(items, { page, pageSize, totalCount }),
      registered,
    };
  }

  async register(
    dto: RegisterCategoryFeaturedDto,
    adminId: string,
  ): Promise<void> {
    const { serviceGroup, serviceIds } = dto;

    // 1. 한도 검증
    const currentCount =
      await this.adminCategoryFeaturedRepository.countByGroup(serviceGroup);
    if (currentCount + serviceIds.length > GROUP_LIMIT) {
      throw new AppException(CATEGORY_FEATURED_ERRORS.LIMIT_EXCEEDED);
    }

    // 2. 중복 등록 방지
    const existing =
      await this.adminCategoryFeaturedRepository.findExistingServiceIdsInGroup(
        serviceGroup,
        serviceIds,
      );
    if (existing.length > 0) {
      throw new AppException(CATEGORY_FEATURED_ERRORS.DUPLICATE);
    }

    // 3. 존재 + group 일치 검증
    const services =
      await this.adminCategoryFeaturedRepository.findServicesByIds(serviceIds);

    if (services.length !== serviceIds.length) {
      throw new AppException(CATEGORY_FEATURED_ERRORS.TARGET_NOT_FOUND);
    }

    const allMatch = services.every(
      (s) => s.serviceGroup.name === serviceGroup,
    );
    if (!allMatch) {
      throw new AppException(CATEGORY_FEATURED_ERRORS.GROUP_MISMATCH);
    }

    // 4. 등록 (트랜잭션, 활동로그 같이)
    await this.adminCategoryFeaturedRepository.createCategoryFeatured({
      serviceGroup,
      serviceIds,
      adminId,
    });
  }

  async delete(dto: DeleteCategoryFeaturedDto, adminId: string): Promise<void> {
    const { serviceGroup, categoryFeaturedIds } = dto;

    // 1. 존재 + serviceGroup 일치 검증
    const rows =
      await this.adminCategoryFeaturedRepository.findCategoryFeaturedByIds(
        categoryFeaturedIds,
      );

    if (rows.length !== categoryFeaturedIds.length) {
      throw new AppException(CATEGORY_FEATURED_ERRORS.NOT_FOUND);
    }

    const allMatch = rows.every((r) => r.serviceGroup.name === serviceGroup);
    if (!allMatch) {
      throw new AppException(CATEGORY_FEATURED_ERRORS.GROUP_MISMATCH_ON_DELETE);
    }

    // 2. 삭제 (트랜잭션, 활동로그 같이)
    await this.adminCategoryFeaturedRepository.deleteCategoryFeatured({
      categoryFeaturedIds,
      adminId,
    });
  }
}
