import { Injectable } from '@nestjs/common';
import { AuthProvider, Role, type User } from '@prisma/client';
import bcrypt from 'bcrypt';

import {
  EXPERT_PROFILE_ERRORS,
  SERVICE_ERRORS,
  USER_ERRORS,
} from '../common/constants/errors';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { AppException } from '../common/exceptions/app.exception';
import { Paginated } from '../common/types/paginated.type';
import { toPaginatedResponse } from '../common/utils/list-response.util';
import { mapServiceCategories } from '../common/utils/service-category.util';
import { resolveAuthorDisplayName } from '../community-posts/community-posts.mapper';
import { ExpertProfilesRepository } from '../expert-profiles/expert-profiles.repository';
import { OrdersService } from '../orders/orders.service';
import { PortfoliosService } from '../portfolios/portfolios.service';
import { MyReviewsQueryDto } from '../services/dto/my-reviews-query.dto';
import { MyReviewListItemResponseDto } from '../services/dto/service-response.dto';
import { ExpertServiceListItemResponse } from '../services/services.mapper';
import { ServicesService } from '../services/services.service';
import { UploadService } from '../upload/upload.service';

import { MyPostsQueryDto } from './dto/my-posts-query.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MyPostListItemResponseDto } from './dto/user-response.dto';
import { MyCommentsQueryDto } from './dto/my-comments-query.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MyCommentListItemResponseDto } from './dto/user-response.dto';
import { UsersRepository } from './users.repository';

import type { UserWithProfiles } from './users.types';
import type {
  CreateOAuthUserParams,
  OAuthProfile,
} from '../auth/oauth/oauth.types';

function mapUser(user: UserWithProfiles) {
  const {
    password: _p,
    blockedByAdminId: _b,
    clientProfile,
    expertProfile,
    ...rest
  } = user;

  if (rest.role === Role.CLIENT) {
    return {
      ...rest,
      clientProfile: clientProfile
        ? {
            ...clientProfile,
            interestCategories: mapServiceCategories(
              clientProfile.interestCategories,
            ),
          }
        : null,
    };
  }

  return {
    ...rest,
    expertProfile: expertProfile
      ? {
          ...expertProfile,
          specialtyCategories: mapServiceCategories(
            expertProfile.specialtyCategories,
          ),
          techStacks: expertProfile.techStacks.map((ts) => ({
            name: ts.techStack.name,
          })),
        }
      : null,
  };
}

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly expertProfilesRepository: ExpertProfilesRepository,
    private readonly portfoliosService: PortfoliosService,
    private readonly uploadService: UploadService,
    private readonly servicesService: ServicesService,
    private readonly ordersService: OrdersService,
  ) {}

  async getUserWithPortfolios(userId: string) {
    const user = await this.usersRepository.findById(userId);

    if (user === null) throw new AppException(USER_ERRORS.NOT_FOUND);

    const expertProfile =
      await this.expertProfilesRepository.findByUserId(userId);

    if (expertProfile === null)
      throw new AppException(EXPERT_PROFILE_ERRORS.NOT_FOUND);

    return this.portfoliosService.findManyByExpertProfileId(expertProfile.id);
  }

  async getUserWithServices(
    userId: string,
    query: PaginationQueryDto,
  ): Promise<Paginated<ExpertServiceListItemResponse>> {
    const user = await this.usersRepository.findById(userId);

    if (user === null) throw new AppException(USER_ERRORS.NOT_FOUND);
    if (user.role !== Role.EXPERT)
      throw new AppException(SERVICE_ERRORS.FORBIDDEN_NOT_EXPERT);

    const expertProfile =
      await this.expertProfilesRepository.findByUserId(userId);

    if (expertProfile === null)
      throw new AppException(EXPERT_PROFILE_ERRORS.NOT_FOUND);

    return this.servicesService.getAllServicesByExpertId(userId, query);
  }

  getAllUser() {
    return 'all user';
  }

  async getUserById(id: string) {
    const user = await this.usersRepository.findByIdWithProfiles(id);
    if (!user) {
      throw new AppException(USER_ERRORS.NOT_FOUND);
    }
    return mapUser(user);
  }

  findUserById(id: string): Promise<User | null> {
    return this.usersRepository.findById(id);
  }

  getUserByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  getUserByProviderId(provider: AuthProvider, providerId: string) {
    return this.usersRepository.findByProviderId(provider, providerId);
  }

  createLocalUser(params: {
    email: string;
    passwordHash: string;
    name: string;
    role: Role;
  }): Promise<User> {
    return this.usersRepository.create({
      email: params.email,
      password: params.passwordHash,
      name: params.name,
      role: params.role,
      provider: AuthProvider.LOCAL,
    });
  }

  createOAuthUser(profile: OAuthProfile, role: Role): Promise<User> {
    const params: CreateOAuthUserParams = { ...profile, role };
    return this.usersRepository.createOAuthUser(params);
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    const existing = await this.usersRepository.findById(id);
    if (!existing) throw new AppException(USER_ERRORS.NOT_FOUND);

    return this.usersRepository.update(id, {
      region: dto.region,
      phoneNumber: dto.phoneNumber,
      bankName: dto.bankName,
      bankAccount: dto.bankAccount,
    });
  }

  async updateProfileImage(
    userId: string,
    file: Express.Multer.File | undefined,
  ) {
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new AppException(USER_ERRORS.NOT_FOUND);

    const oldKey = user.profileImageUrl
      ? new URL(user.profileImageUrl).pathname.slice(1)
      : null;

    const { url } = await this.uploadService.uploadImage(
      file,
      `profiles/${userId}`,
    );

    const updated = await this.usersRepository.update(userId, {
      profileImageUrl: url,
    });

    if (oldKey) {
      await this.uploadService.deleteImages([oldKey]);
    }

    return updated;
  }

  async updatePassword(id: string, dto: UpdatePasswordDto): Promise<object> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppException(USER_ERRORS.NOT_FOUND);
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      dto.currentPassword,
      user.password ?? '',
    );
    if (!isCurrentPasswordValid) {
      throw new AppException(USER_ERRORS.INVALID_PASSWORD);
    }

    if (dto.newPassword !== dto.newPasswordConfirm) {
      throw new AppException(USER_ERRORS.PASSWORD_MISMATCH);
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 12);
    await this.usersRepository.updatePassword(id, hashedPassword);
    return {};
  }

  async withdrawUser(id: string, reason?: string) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppException(USER_ERRORS.NOT_FOUND);
    }

    const { isDeleted, deletedAt, deletionReason } =
      await this.usersRepository.update(id, {
        isDeleted: true,
        deletedAt: new Date(),
        deletionReason: reason,
      });

    return { isDeleted, deletedAt, deletionReason };
  }

  async getAllReviewsByUserId(
    userId: string,
    query: MyReviewsQueryDto,
  ): Promise<Paginated<MyReviewListItemResponseDto>> {
    const user = await this.usersRepository.findById(userId);

    if (user === null) throw new AppException(USER_ERRORS.NOT_FOUND);

    return this.ordersService.getAllReviewsByUserId(userId, query);
  }

  async getAllPostsByUserId(
    userId: string,
    query: MyPostsQueryDto,
  ): Promise<Paginated<MyPostListItemResponseDto>> {
    const user = await this.usersRepository.findById(userId);

  async getAllCommentsByUserId(
    userId: string,
    query: MyCommentsQueryDto,
  ): Promise<Paginated<MyCommentListItemResponseDto>> {
    const user = await this.usersRepository.findById(userId);
    if (user === null) throw new AppException(USER_ERRORS.NOT_FOUND);

    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;
    const sort = query.sort ?? 'latest';
    const skip = (page - 1) * pageSize;
    const category = query.category;

    const [posts, totalCount] = await Promise.all([
      this.usersRepository.findAllPostsByUserId({
        userId,
        skip,
        take: pageSize,
        sort,
        category,
      }),
      this.usersRepository.countPosts(userId, category),
    ]);

    return toPaginatedResponse(
      posts.map((post) => ({
        id: post.id,
        category: post.category,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt.toISOString(),
        authorDisplayName: resolveAuthorDisplayName(post.user),
        likeCount: post._count.likeRecords,
        commentCount: post._count.comments,
      })),
      { page, pageSize, totalCount },
    );
  }
}
