import { Injectable } from '@nestjs/common';
import { AdminActionType, NotificationCategory, Role } from '@prisma/client';

import {
  EXPERT_PROFILE_ERRORS,
  USER_ERRORS,
} from '../../common/constants/errors';
import { AppException } from '../../common/exceptions/app.exception';
import { Paginated } from '../../common/types/paginated.type';
import { toPaginatedResponse } from '../../common/utils/list-response.util';
import { NotificationsService } from '../../notifications/notifications.service';

import { AdminUserRepository } from './admin-user.repository';
import { BlacklistCountsDto } from './dto/blacklist/blacklist-counts-response.dto';
import { GetBlacklistQueryDto } from './dto/blacklist/blacklist-query.dto';
import { BlacklistItemDto } from './dto/blacklist/blacklist-response.dto';
import { BlacklistStatus } from './dto/blacklist/blacklist-status.enum';
import { UserCommentItemDto } from './dto/detail/user-comments-response.dto';
import { UserDetailResponseDto } from './dto/detail/user-detail-response.dto';
import { UserOrderItemDto } from './dto/detail/user-orders-response.dto';
import {
  deriveDeletionStatus,
  UserPostItemDto,
} from './dto/detail/user-posts-response.dto';
import { UserReportReceivedItemDto } from './dto/detail/user-reports-received-response.dto';
import { UserReportSentItemDto } from './dto/detail/user-reports-sent-response.dto';
import { UserServiceItemDto } from './dto/detail/user-services-response.dto';
import { ExpertApprovalStatus } from './dto/list/expert-approval-status.enum';
import { UserCounstDto } from './dto/list/users-counts-response.dto';
import { GetUsersQueryDto } from './dto/list/users-query.dto';
import { UserItemDto } from './dto/list/users-response.dto';
import { type PageQueryDto } from './dto/page-query.dto';

@Injectable()
export class AdminUserService {
  constructor(
    private readonly adminUserRepository: AdminUserRepository,
    private readonly notificationsService: NotificationsService,
  ) {}

  async getUsers(query: GetUsersQueryDto): Promise<Paginated<UserItemDto>> {
    const role = query.role ?? Role.CLIENT;
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 50;
    const skip = (page - 1) * pageSize;
    const isExpert = role === Role.EXPERT;

    const resolvedQuery: GetUsersQueryDto = {
      role,
      page: query.page,
      pageSize: query.pageSize,
      provider: query.provider,
      region: query.region,
      search: query.search,
      status: query.status,
      specialtyGroup: query.specialtyGroup,
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
      paymentCount: isExpert
        ? u._count.ordersAsExpert
        : u._count.ordersAsClient,
      reportCount: u._count.receivedReports,
      businessName: isExpert ? (u.expertProfile?.businessName ?? null) : null,
      specialtyGroup: isExpert
        ? (u.expertProfile?.specialtyCategories[0]?.serviceGroup.name ?? null)
        : null,
      approvalStatus: isExpert
        ? this.#deriveApprovalStatus(u.expertProfile)
        : null,
      createdAt: u.createdAt,
    }));

    return toPaginatedResponse(items, { page, pageSize, totalCount });
  }

  #deriveApprovalStatus(
    profile: {
      isApplied: boolean;
      isApproved: boolean;
      rejectedAt: Date | null;
    } | null,
  ): ExpertApprovalStatus | null {
    if (!profile) return null;
    if (profile.rejectedAt) return ExpertApprovalStatus.REJECTED;
    if (profile.isApproved) return ExpertApprovalStatus.APPROVED;
    if (profile.isApplied) return ExpertApprovalStatus.PENDING;
    return null;
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

  async getUserOrders(
    userId: string,
    query: PageQueryDto,
  ): Promise<Paginated<UserOrderItemDto>> {
    const user = await this.adminUserRepository.findRoleById(userId);
    if (!user) throw new AppException(USER_ERRORS.NOT_FOUND);
    if (user.role !== Role.CLIENT) {
      throw new AppException(USER_ERRORS.ROLE_MISMATCH);
    }

    const page = query.page ?? 1;
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const [rows, totalCount] = await Promise.all([
      this.adminUserRepository.findOrdersByClientId(userId, skip, pageSize),
      this.adminUserRepository.countOrdersByClientId(userId),
    ]);

    const items: UserOrderItemDto[] = rows.map((o) => ({
      id: o.id,
      service: { id: o.service.id, title: o.service.title },
      expert: { id: o.expertUser.id, name: o.expertUser.name },
      status: o.status,
      totalAmount: o.totalAmount,
      platformFee: o.platformFee,
      endDate: o.endDate,
      refund: o.payment?.refund
        ? `${o.payment.refund.type}_${o.payment.refund.status}`
        : null,
      createdAt: o.createdAt,
    }));

    return toPaginatedResponse(items, { page, pageSize, totalCount });
  }

  async getUserServices(
    userId: string,
    query: PageQueryDto,
  ): Promise<Paginated<UserServiceItemDto>> {
    const user = await this.adminUserRepository.findRoleById(userId);
    if (!user) throw new AppException(USER_ERRORS.NOT_FOUND);
    if (user.role !== Role.EXPERT) {
      throw new AppException(USER_ERRORS.ROLE_MISMATCH);
    }

    const page = query.page ?? 1;
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const [rows, totalCount] = await Promise.all([
      this.adminUserRepository.findServicesByExpertId(userId, skip, pageSize),
      this.adminUserRepository.countServicesByExpertId(userId),
    ]);

    const items: UserServiceItemDto[] = rows.map((s) => ({
      id: s.id,
      title: s.title,
      status: s.status,
      servicePrice: s.servicePrice,
      salesCount: s._count.orders,
      createdAt: s.createdAt,
    }));

    return toPaginatedResponse(items, { page, pageSize, totalCount });
  }

  async getUserReportsReceived(
    userId: string,
    query: PageQueryDto,
  ): Promise<Paginated<UserReportReceivedItemDto>> {
    const user = await this.adminUserRepository.findRoleById(userId);
    if (!user) throw new AppException(USER_ERRORS.NOT_FOUND);

    const page = query.page ?? 1;
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const [rows, totalCount] = await Promise.all([
      this.adminUserRepository.findReportsReceivedByUserId(
        userId,
        skip,
        pageSize,
      ),
      this.adminUserRepository.countReportsReceivedByUserId(userId),
    ]);

    const items: UserReportReceivedItemDto[] = rows.map((r) => ({
      id: r.id,
      reporter: { id: r.reporter.id, name: r.reporter.name },
      detail: r.detail,
      reason: r.reason,
      createdAt: r.createdAt,
    }));

    return toPaginatedResponse(items, { page, pageSize, totalCount });
  }

  async getUserReportsSent(
    userId: string,
    query: PageQueryDto,
  ): Promise<Paginated<UserReportSentItemDto>> {
    const user = await this.adminUserRepository.findRoleById(userId);
    if (!user) throw new AppException(USER_ERRORS.NOT_FOUND);

    const page = query.page ?? 1;
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const [rows, totalCount] = await Promise.all([
      this.adminUserRepository.findReportsSentByUserId(userId, skip, pageSize),
      this.adminUserRepository.countReportsSentByUserId(userId),
    ]);

    const items: UserReportSentItemDto[] = rows.map((r) => ({
      id: r.id,
      reported: { id: r.reported.id, name: r.reported.name },
      detail: r.detail,
      reason: r.reason,
      createdAt: r.createdAt,
    }));
    return toPaginatedResponse(items, { page, pageSize, totalCount });
  }

  async getUserPosts(
    userId: string,
    query: PageQueryDto,
  ): Promise<Paginated<UserPostItemDto>> {
    const user = await this.adminUserRepository.findRoleById(userId);
    if (!user) throw new AppException(USER_ERRORS.NOT_FOUND);
    const page = query.page ?? 1;
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const [rows, totalCount] = await Promise.all([
      this.adminUserRepository.findPostsByUserId(userId, skip, pageSize),
      this.adminUserRepository.countPostsByUserId(userId),
    ]);

    const items: UserPostItemDto[] = rows.map((p) => ({
      id: p.id,
      title: p.title,
      status: deriveDeletionStatus(p.deletedAt, p.deletedByAdminId),
      deletedAt: p.deletedAt,
      deletedByAdminName: p.deletedByAdmin?.name ?? null,
      createdAt: p.createdAt,
    }));

    return toPaginatedResponse(items, { page, pageSize, totalCount });
  }

  async getUserComments(
    userId: string,
    query: PageQueryDto,
  ): Promise<Paginated<UserCommentItemDto>> {
    const user = await this.adminUserRepository.findRoleById(userId);
    if (!user) throw new AppException(USER_ERRORS.NOT_FOUND);

    const page = query.page ?? 1;
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const [rows, totalCount] = await Promise.all([
      this.adminUserRepository.findCommentsByUserId(userId, skip, pageSize),
      this.adminUserRepository.countCommentsByUserId(userId),
    ]);

    const items: UserCommentItemDto[] = rows.map((c) => ({
      id: c.id,
      content: c.content,
      status: deriveDeletionStatus(c.deletedAt, c.deletedByAdminId),
      deletedAt: c.deletedAt,
      deletedByAdminName: c.deletedByAdmin?.name ?? null,
      createdAt: c.createdAt,
    }));

    return toPaginatedResponse(items, { page, pageSize, totalCount });
  }

  async blockUser(userId: string, adminId: string): Promise<void> {
    const user = await this.adminUserRepository.findById(userId);
    if (!user) throw new AppException(USER_ERRORS.NOT_FOUND);
    if (user.isBlocked) throw new AppException(USER_ERRORS.ALREADY_BLOCKED);

    await this.adminUserRepository.blockUser(
      userId,
      adminId,
      AdminActionType.BLACKLIST_ADDED,
    );
  }

  async unblockUser(userId: string, adminId: string): Promise<void> {
    const user = await this.adminUserRepository.findById(userId);
    if (!user) throw new AppException(USER_ERRORS.NOT_FOUND);
    if (!user.isBlocked) throw new AppException(USER_ERRORS.NOT_BLOCKED);

    await this.adminUserRepository.blockUser(
      userId,
      adminId,
      AdminActionType.BLACKLIST_REMOVED,
    );
  }

  async approveExpert(userId: string, adminId: string): Promise<void> {
    const user = await this.adminUserRepository.findById(userId);
    if (!user) throw new AppException(USER_ERRORS.NOT_FOUND);
    if (user.role !== Role.EXPERT)
      throw new AppException(USER_ERRORS.ROLE_MISMATCH);
    if (!user.expertProfile)
      throw new AppException(EXPERT_PROFILE_ERRORS.NOT_FOUND);
    if (user.expertProfile.isApproved)
      throw new AppException(EXPERT_PROFILE_ERRORS.ALREADY_APPROVED);
    if (!user.expertProfile.isApplied)
      throw new AppException(EXPERT_PROFILE_ERRORS.NOT_APPLIED);

    await this.adminUserRepository.approveExpert(userId, adminId);

    await this.notificationsService.send({
      userIds: [userId],
      category: NotificationCategory.EXPERT_APPROVED,
    });
  }

  async rejectExpert(
    userId: string,
    adminId: string,
    rejectReason: string,
  ): Promise<void> {
    const user = await this.adminUserRepository.findById(userId);
    if (!user) throw new AppException(USER_ERRORS.NOT_FOUND);
    if (user.role !== Role.EXPERT)
      throw new AppException(USER_ERRORS.ROLE_MISMATCH);
    if (!user.expertProfile)
      throw new AppException(EXPERT_PROFILE_ERRORS.NOT_FOUND);
    if (user.expertProfile.isApproved)
      throw new AppException(EXPERT_PROFILE_ERRORS.ALREADY_APPROVED);
    if (!user.expertProfile.isApplied)
      throw new AppException(EXPERT_PROFILE_ERRORS.NOT_APPLIED);

    await this.adminUserRepository.rejectExpert(userId, adminId, rejectReason);

    await this.notificationsService.send({
      userIds: [userId],
      category: NotificationCategory.EXPERT_REJECTED,
      vars: { rejectReason },
    });
  }

  async getBlacklist(
    query: GetBlacklistQueryDto,
  ): Promise<Paginated<BlacklistItemDto>> {
    const role = query.role ?? Role.CLIENT;
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 50;
    const skip = (page - 1) * pageSize;
    const isExpert = role === Role.EXPERT;

    const resolvedQuery: GetBlacklistQueryDto = {
      role,
      page: query.page,
      pageSize: query.pageSize,
      search: query.search,
    };

    const [rows, totalCount] = await Promise.all([
      this.adminUserRepository.findBlacklist(resolvedQuery, skip, pageSize),
      this.adminUserRepository.countBlacklist(resolvedQuery),
    ]);

    const items: BlacklistItemDto[] = rows.map((u) => ({
      id: u.id,
      name: u.name,
      businessName: isExpert ? (u.expertProfile?.businessName ?? null) : null,
      email: u.email,
      provider: u.provider,
      region: u.region,
      paymentCount: isExpert
        ? u._count.ordersAsExpert
        : u._count.ordersAsClient,
      reportCount: u._count.receivedReports,
      status: BlacklistStatus.BLACKLISTED,
      createdAt: u.createdAt,
    }));

    return toPaginatedResponse(items, { page, pageSize, totalCount });
  }

  async getBlacklistCounts(): Promise<BlacklistCountsDto> {
    const [client, expert] = await Promise.all([
      this.adminUserRepository.countBlacklistByRole(Role.CLIENT),
      this.adminUserRepository.countBlacklistByRole(Role.EXPERT),
    ]);
    return { client, expert };
  }
}
