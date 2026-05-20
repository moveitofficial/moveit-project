import { Injectable } from '@nestjs/common';
import { AuthProvider, Role, type User } from '@prisma/client';
import bcrypt from 'bcrypt';

import { ClientProfilesRepository } from '../client-profiles/client-profiles.repository';
import {
  CLIENT_PROFILE_ERRORS,
  EXPERT_PROFILE_ERRORS,
  USER_ERRORS,
} from '../common/constants/errors';
import { AppException } from '../common/exceptions/app.exception';
import { mapServiceCategories } from '../common/utils/service-category.util';
import { ExpertProfilesRepository } from '../expert-profiles/expert-profiles.repository';

import { UpdateClientProfileDto } from './dto/update-client-profile.dto';
import { UpdateExpertProfileDto } from './dto/update-expert-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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
    private readonly clientProfilesRepository: ClientProfilesRepository,
    private readonly expertProfilesRepository: ExpertProfilesRepository,
  ) {}

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

  async updateClientProfile(id: string, dto: UpdateClientProfileDto) {
    const existing = await this.usersRepository.findByIdWithProfiles(id);
    if (!existing) throw new AppException(USER_ERRORS.NOT_FOUND);

    if (dto.interestCategories && dto.interestCategories.length > 0) {
      const groups = new Set(dto.interestCategories.map((c) => c.group));
      if (groups.size > 1)
        throw new AppException(CLIENT_PROFILE_ERRORS.MIXED_SERVICE_GROUP);
    }

    const profileData = {
      nickname: dto.nickname,
      interestCategories: dto.interestCategories,
    };

    const profile = await (existing.clientProfile
      ? this.clientProfilesRepository.update(id, profileData)
      : this.clientProfilesRepository.create(id, profileData));

    return {
      ...profile,
      interestCategories: mapServiceCategories(profile.interestCategories),
    };
  }

  async updateExpertProfile(id: string, dto: UpdateExpertProfileDto) {
    const existing = await this.usersRepository.findByIdWithProfiles(id);
    if (!existing) throw new AppException(USER_ERRORS.NOT_FOUND);

    if (dto.specialtyCategories && dto.specialtyCategories.length > 0) {
      const groups = new Set(dto.specialtyCategories.map((c) => c.group));
      if (groups.size > 1)
        throw new AppException(EXPERT_PROFILE_ERRORS.MIXED_SERVICE_GROUP);
    }

    const profileData = {
      businessName: dto.businessName,
      businessNumber: dto.businessNumber,
      ceoName: dto.ceoName,
      contactTimeStart: dto.contactTimeStart,
      contactTimeEnd: dto.contactTimeEnd,
      foundedYear: dto.foundedYear,
      employeeMin: dto.employeeMin,
      employeeMax: dto.employeeMax,
      description: dto.description,
      specialtyCategories: dto.specialtyCategories,
      techStackNames: dto.techStackNames,
    };

    const profile = await (existing.expertProfile
      ? this.expertProfilesRepository.update(id, profileData)
      : this.expertProfilesRepository.create(id, profileData));

    return {
      ...profile,
      specialtyCategories: mapServiceCategories(profile.specialtyCategories),
      techStacks: profile.techStacks.map((ts) => ({ name: ts.techStack.name })),
    };
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
}
