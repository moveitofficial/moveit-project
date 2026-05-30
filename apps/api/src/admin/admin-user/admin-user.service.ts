import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';

import { USER_ERRORS } from '../../common/constants/errors';
import { AppException } from '../../common/exceptions/app.exception';
import { Paginated } from '../../common/types/paginated.type';
import { toPaginatedResponse } from '../../common/utils/list-response.util';

import { AdminUserRepository } from './admin-user.repository';
import { UserDetailResponseDto } from './dto/user-detail-response.dto';
import { UserCounstDto } from './dto/users-counts-response.dto';
import { GetUsersQueryDto } from './dto/users-query.dto';
import { UserItemDto } from './dto/users-response.dto';

@Injectable()
export class AdminUserService {
  constructor(private readonly adminUserRepository: AdminUserRepository) {}

  async getUsers(query: GetUsersQueryDto): Promise<Paginated<UserItemDto>> {
    const role = query.role ?? Role.CLIENT;
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 50;
    const skip = (page - 1) * pageSize;

    const resolvedQuery: GetUsersQueryDto = {
      role,
      page: query.page,
      pageSize: query.pageSize,
      provider: query.provider,
      region: query.region,
      search: query.search,
    };

    const [rows, totalCount] = await Promise.all([
      this.adminUserRepository.findUsers(resolvedQuery, skip, pageSize),
      this.adminUserRepository.countUsers(resolvedQuery),
    ]);

    const items: UserItemDto[] = rows.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      provider: u.provider,
      region: u.region,
      paymentCount:
        role === Role.CLIENT
          ? u._count.ordersAsClient
          : u._count.ordersAsExpert,
      reportCount: u._count.receivedReports,
      createdAt: u.createdAt,
    }));

    return toPaginatedResponse(items, { page, pageSize, totalCount });
  }

  async getCounts(): Promise<UserCounstDto> {
    const [client, expert] = await Promise.all([
      this.adminUserRepository.countByRole(Role.CLIENT),
      this.adminUserRepository.countByRole(Role.EXPERT),
    ]);
    return { client, expert };
  }

  async getUserDetail(id: string): Promise<UserDetailResponseDto> {
    const user = await this.adminUserRepository.findById(id);
    if (!user) {
      throw new AppException(USER_ERRORS.NOT_FOUND);
    }

    // role 분기 — CLIENT면 nickname만, EXPERT면 expert 블록만 (specialty는 양쪽 다 top-level)
    const isClient = user.role === Role.CLIENT;
    const nickname = user.clientProfile?.nickname ?? null;

    // CLIENT는 관심분야, EXPERT는 전문분야 — 같은 모양이라 specialty로 통합
    const specialtyRows = isClient
      ? (user.clientProfile?.interestCategories ?? []).map((c) => ({
          serviceGroup: c.serviceGroup,
          serviceCategory: c.serviceCategory,
        }))
      : (user.expertProfile?.specialtyCategories ?? []).map((s) => ({
          serviceGroup: s.serviceGroup,
          serviceCategory: s.serviceCategory,
        }));
    const firstSpecialty = specialtyRows[0];
    const specialty = firstSpecialty
      ? {
          serviceGroupName: firstSpecialty.serviceGroup.name,
          serviceCategoryNames: specialtyRows.map(
            (r) => r.serviceCategory.name,
          ),
        }
      : null;

    const expert =
      user.role === Role.EXPERT && user.expertProfile
        ? {
            isApplied: user.expertProfile.isApplied,
            isApproved: user.expertProfile.isApproved,
            approvedAt: user.expertProfile.approvedAt,
            approvedByAdminName:
              user.expertProfile.approvedByAdmin?.name ?? null,
            rejectedAt: user.expertProfile.rejectedAt,
            rejectReason: user.expertProfile.rejectReason,

            businessName: user.expertProfile.businessName,
            businessNumber: user.expertProfile.businessNumber,
            ceoName: user.expertProfile.ceoName,
            contactTimeStart: user.expertProfile.contactTimeStart,
            contactTimeEnd: user.expertProfile.contactTimeEnd,
            foundedYear: user.expertProfile.foundedYear,
            employeeMin: user.expertProfile.employeeMin,
            employeeMax: user.expertProfile.employeeMax,
            description: user.expertProfile.description,

            techStacks: user.expertProfile.techStacks.map(
              (t) => t.techStack.name,
            ),
            portfolios: user.expertProfile.portfolios.map((p) => ({
              id: p.id,
              title: p.title,
              mainImageUrl: p.images[0]?.imgUrl ?? null,
            })),
          }
        : undefined;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      provider: user.provider,
      role: user.role,
      region: user.region,
      phoneNumber: user.phoneNumber,
      profileImageUrl: user.profileImageUrl,
      bankName: user.bankName,
      bankAccount: user.bankAccount,
      createdAt: user.createdAt,

      isBlocked: user.isBlocked,
      blockedAt: user.blockedAt,
      blockedByAdminName: user.blockedByAdmin?.name ?? null,

      // specialty는 role 무관 top-level. role별 추가 필드만 conditional.
      specialty,
      ...(isClient ? { nickname } : { expert }),
    };
  }
}
