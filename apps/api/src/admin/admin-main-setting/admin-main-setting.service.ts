import { Injectable } from '@nestjs/common';
import {
  MainSectionType,
  MainTargetType,
  ServiceGroupName,
} from '@prisma/client';

import {
  MAIN_SETTING_ERRORS,
  BANNER_ERRORS,
} from '../../common/constants/errors';
import { AppException } from '../../common/exceptions/app.exception';
import { toPaginatedResponse } from '../../common/utils/list-response.util';
import { UploadService } from '../../upload/upload.service';

import { AdminMainSettingRepository } from './admin-main-setting.repository';

import type { GetCandidatesQueryDto } from './dto/candidates-query.dto';
import type {
  ExpertCandidateItemDto,
  ExpertCandidatesResponseDto,
  RegisteredExpertItemDto,
  RegisteredServiceItemDto,
  ServiceCandidateItemDto,
  ServiceCandidatesResponseDto,
} from './dto/candidates-response.dto';
import type { DeleteBannerDto } from './dto/delete-banner.dto';
import type { DeleteMainSettingDto } from './dto/delete-request.dto';
import type {
  ExpertMainItemDto,
  MainSettingResponseDto,
  ServiceMainItemDto,
  BannerItemDto,
} from './dto/main-setting-response.dto';
import type { RegisterBannerDto } from './dto/register-banner.dto';
import type { RegisterMainSettingDto } from './dto/register-request.dto';

const SERVICE_SECTION_TYPES_SET = new Set<MainSectionType>([
  MainSectionType.POPULAR_IT_COACHING,
  MainSectionType.POPULAR_PROJECT_REQUEST,
  MainSectionType.RECOMMENDED_IT_COACHING,
  MainSectionType.RECOMMENDED_PROJECT_REQUEST,
]);

const SECTION_TO_GROUP: Record<MainSectionType, ServiceGroupName> = {
  POPULAR_IT_COACHING: ServiceGroupName.IT_COACHING,
  POPULAR_PROJECT_REQUEST: ServiceGroupName.PROJECT_REQUEST,
  RECOMMENDED_IT_COACHING: ServiceGroupName.IT_COACHING,
  RECOMMENDED_PROJECT_REQUEST: ServiceGroupName.PROJECT_REQUEST,
  MOVEIT_POPULAR_PROJECT_EXPERT: ServiceGroupName.PROJECT_REQUEST,
  MOVEIT_POPULAR_COACHING: ServiceGroupName.IT_COACHING,
};

const SECTION_LIMIT = 4;
const BANNER_LIMIT = 1;

@Injectable()
export class AdminMainSettingService {
  constructor(
    private readonly adminMainSettingRepository: AdminMainSettingRepository,
    private readonly uploadService: UploadService,
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

  async getServiceCandidates(
    query: GetCandidatesQueryDto,
  ): Promise<ServiceCandidatesResponseDto> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const sort = query.sort ?? 'sales';
    const skip = (page - 1) * pageSize;

    const [rows, totalCount, registeredRows] = await Promise.all([
      this.adminMainSettingRepository.findServiceCandidates({
        sectionType: query.sectionType,
        search: query.search,
        sort,
        skip,
        take: pageSize,
      }),
      this.adminMainSettingRepository.countServiceCandidates({
        sectionType: query.sectionType,
        search: query.search,
      }),
      this.adminMainSettingRepository.findRegisteredServicesBySection(
        query.sectionType,
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

  async getExpertCandidates(
    query: GetCandidatesQueryDto,
  ): Promise<ExpertCandidatesResponseDto> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const sort = query.sort ?? 'sales';
    const skip = (page - 1) * pageSize;

    const [rows, totalCount, registeredRows] = await Promise.all([
      this.adminMainSettingRepository.findExpertCandidates({
        sectionType: query.sectionType,
        search: query.search,
        sort,
        skip,
        take: pageSize,
      }),
      this.adminMainSettingRepository.countExpertCandidates({
        sectionType: query.sectionType,
        search: query.search,
      }),
      this.adminMainSettingRepository.findRegisteredExpertsBySection(
        query.sectionType,
      ),
    ]);

    const registeredSet = new Set(registeredRows.map((r) => r.id));

    const items: ExpertCandidateItemDto[] = rows.map((u) => {
      const specialtySet = new Set(
        u.expertProfile?.specialtyCategories.map((c) => c.serviceGroup.name) ??
          [],
      );
      return {
        userId: u.id,
        businessName: u.expertProfile?.businessName ?? null,
        email: u.email,
        specialties: [...specialtySet],
        provider: u.provider,
        isApproved: u.expertProfile?.isApproved ?? false,
        region: u.region,
        saleCount: u._count.ordersAsExpert,
        reportCount: u._count.receivedReports,
        createdAt: u.createdAt,
        isAlreadyRegistered: registeredSet.has(u.id),
      };
    });

    const registered: RegisteredExpertItemDto[] = registeredRows.map((r) => ({
      userId: r.id,
      businessName: r.businessName,
    }));

    return {
      ...toPaginatedResponse(items, { page, pageSize, totalCount }),
      registered,
    };
  }

  async register(dto: RegisterMainSettingDto, adminId: string): Promise<void> {
    const { sectionType, targetIds } = dto;
    const targetType = SERVICE_SECTION_TYPES_SET.has(sectionType)
      ? MainTargetType.SERVICE
      : MainTargetType.USER;

    // 1. 한도 검증
    const currentCount =
      await this.adminMainSettingRepository.countBySectionType(sectionType);
    if (currentCount + targetIds.length > SECTION_LIMIT) {
      throw new AppException(MAIN_SETTING_ERRORS.LIMIT_EXCEEDED);
    }

    // 2. 중복 등록 방지
    const existing =
      await this.adminMainSettingRepository.findExistingTargetIdsInSection(
        sectionType,
        targetIds,
      );
    if (existing.length > 0) {
      throw new AppException(MAIN_SETTING_ERRORS.DUPLICATE);
    }

    // 3. group 일치 + 존재 검증
    await (targetType === MainTargetType.SERVICE
      ? this.#validateServiceTargets(sectionType, targetIds)
      : this.#validateExpertTargets(sectionType, targetIds));

    // 4. 등록 (트랜잭션)
    await this.adminMainSettingRepository.createMainSettings({
      sectionType,
      targetType,
      targetIds,
      adminId,
    });
  }

  async #validateServiceTargets(
    sectionType: MainSectionType,
    serviceIds: string[],
  ): Promise<void> {
    const services =
      await this.adminMainSettingRepository.findServicesByIds(serviceIds);

    if (services.length !== serviceIds.length) {
      throw new AppException(MAIN_SETTING_ERRORS.TARGET_NOT_FOUND);
    }

    const expectedGroup = SECTION_TO_GROUP[sectionType];
    const allMatch = services.every(
      (s) => s.serviceGroup.name === expectedGroup,
    );
    if (!allMatch) {
      throw new AppException(MAIN_SETTING_ERRORS.GROUP_MISMATCH);
    }
  }

  async #validateExpertTargets(
    sectionType: MainSectionType,
    userIds: string[],
  ): Promise<void> {
    const experts =
      await this.adminMainSettingRepository.findExpertsByIds(userIds);

    if (experts.length !== userIds.length) {
      throw new AppException(MAIN_SETTING_ERRORS.TARGET_NOT_FOUND);
    }

    const expectedGroup = SECTION_TO_GROUP[sectionType];
    const allValid = experts.every((u) => {
      if (u.role !== 'EXPERT') return false;
      if (u.expertProfile?.isApproved !== true) return false;
      return u.expertProfile.specialtyCategories.some(
        (c) => c.serviceGroup.name === expectedGroup,
      );
    });
    if (!allValid) {
      throw new AppException(MAIN_SETTING_ERRORS.GROUP_MISMATCH);
    }
  }

  async delete(dto: DeleteMainSettingDto, adminId: string): Promise<void> {
    const { sectionType, mainSettingIds } = dto;

    // 1. 존재 + sectionType 일치 검증
    const rows =
      await this.adminMainSettingRepository.findMainSettingsByIds(
        mainSettingIds,
      );

    if (rows.length !== mainSettingIds.length) {
      throw new AppException(MAIN_SETTING_ERRORS.NOT_FOUND);
    }

    const allMatch = rows.every((r) => r.sectionType === sectionType);
    if (!allMatch) {
      throw new AppException(MAIN_SETTING_ERRORS.SECTION_MISMATCH);
    }

    // 2. 삭제 (트랜잭션, 활동로그 같이)
    await this.adminMainSettingRepository.deleteMainSettings({
      mainSettingIds,
      adminId,
    });
  }

  async registerBanner(
    file: Express.Multer.File | undefined,
    body: RegisterBannerDto,
    adminId: string,
  ): Promise<BannerItemDto> {
    // 1. 한도 검증 — S3 업로드 전!
    const count = await this.adminMainSettingRepository.countBanners();
    if (count >= BANNER_LIMIT) {
      throw new AppException(BANNER_ERRORS.LIMIT_EXCEEDED);
    }

    // 2. S3 업로드
    const { url } = await this.uploadService.uploadBannerImage(file);

    // 3. DB 저장 + 활동로그 (트랜잭션)
    const created = await this.adminMainSettingRepository.createBanner({
      imageUrl: url,
      actionUrl: body.actionUrl,
      adminId,
    });

    return {
      id: created.id,
      imageUrl: url,
      actionUrl: body.actionUrl,
      createdAt: new Date(),
    };
  }

  async deleteBanners(dto: DeleteBannerDto, adminId: string): Promise<void> {
    // 1. 존재 검증 + imageUrl 가져옴
    const banners = await this.adminMainSettingRepository.findBannersByIds(
      dto.bannerIds,
    );
    if (banners.length !== dto.bannerIds.length) {
      throw new AppException(BANNER_ERRORS.NOT_FOUND);
    }

    // 2. S3 키 추출
    const keys = banners.map((b) => this.#extractS3Key(b.imageUrl));

    // 3. DB 삭제 (트랜잭션, 활동로그 같이)
    await this.adminMainSettingRepository.deleteBanners({
      bannerIds: dto.bannerIds,
      adminId,
    });

    // 4. S3 정리 (DB 트랜잭션 완료 후 — 실패해도 orphan S3만 남음)
    await this.uploadService.deleteImages(keys);
  }

  // S3 URL → key 추출
  #extractS3Key(imageUrl: string): string {
    return new URL(imageUrl).pathname.slice(1);
  }
}
