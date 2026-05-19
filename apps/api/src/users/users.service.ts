import { Injectable } from '@nestjs/common';
import { AuthProvider, Role, type User } from '@prisma/client';
import bcrypt from 'bcrypt';

import { ClientProfilesRepository } from '../client-profiles/client-profiles.repository';
import { USER_ERRORS } from '../common/constants/errors';
import { AppException } from '../common/exceptions/app.exception';
import { mapServiceCategories } from '../common/utils/service-category.util';
import { ExpertProfilesRepository } from '../expert-profiles/expert-profiles.repository';
import { PrismaService } from '../prisma/prisma.service';

import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';

import type { UserWithProfiles } from './users.types';
import type {
  CreateOAuthUserParams,
  OAuthProfile,
} from '../auth/oauth/oauth.types';

function mapUser(user: UserWithProfiles) {
  const { password: _p, blockedByAdminId: _b, ...rest } = user;
  return {
    ...rest,
    clientProfile: user.clientProfile
      ? {
          ...user.clientProfile,
          interestCategories: mapServiceCategories(
            user.clientProfile.interestCategories,
          ),
        }
      : null,
    expertProfile: user.expertProfile
      ? {
          ...user.expertProfile,
          specialtyCategories: mapServiceCategories(
            user.expertProfile.specialtyCategories,
          ),
          techStacks: user.expertProfile.techStacks.map((ts) => ({
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
    private readonly prisma: PrismaService,
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
    const existing = await this.usersRepository.findByIdWithProfiles(id);
    if (!existing) throw new AppException(USER_ERRORS.NOT_FOUND);

    const userFields = {
      region: dto.region,
      phoneNumber: dto.phoneNumber,
      bankName: dto.bankName,
      bankAccount: dto.bankAccount,
    };

    const hasClientProfileFields =
      dto.nickname !== undefined || dto.interestCategories !== undefined;
    const hasExpertProfileFields =
      dto.businessName !== undefined ||
      dto.businessNumber !== undefined ||
      dto.ceoName !== undefined ||
      dto.contactTimeStart !== undefined ||
      dto.contactTimeEnd !== undefined ||
      dto.foundedYear !== undefined ||
      dto.employeeMin !== undefined ||
      dto.employeeMax !== undefined ||
      dto.description !== undefined ||
      dto.specialtyCategories !== undefined ||
      dto.techStackNames !== undefined;

    const needsProfileUpdate =
      (existing.role === Role.CLIENT &&
        existing.clientProfile !== null &&
        hasClientProfileFields) ||
      (existing.role === Role.EXPERT &&
        existing.expertProfile !== null &&
        hasExpertProfileFields);

    await (needsProfileUpdate
      ? this.prisma.$transaction(async (tx) => {
          await this.usersRepository.update(id, userFields, tx);
          if (existing.role === Role.CLIENT && existing.clientProfile) {
            await this.clientProfilesRepository.update(
              id,
              {
                nickname: dto.nickname,
                interestCategories: dto.interestCategories,
              },
              tx,
            );
          } else if (existing.role === Role.EXPERT && existing.expertProfile) {
            await this.expertProfilesRepository.update(
              id,
              {
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
              },
              tx,
            );
          }
        })
      : this.usersRepository.update(id, userFields));

    const updated = await this.usersRepository.findByIdWithProfiles(id);
    if (!updated) throw new AppException(USER_ERRORS.NOT_FOUND);
    return mapUser(updated);
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

  async withdrawUser(id: string) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppException(USER_ERRORS.NOT_FOUND);
    }

    const { isDeleted, deletedAt } = await this.usersRepository.update(id, {
      isDeleted: true,
      deletedAt: new Date(),
    });

    return { isDeleted, deletedAt };
  }
}
