import { Injectable } from '@nestjs/common';

import { EXPERT_PROFILE_ERRORS, USER_ERRORS } from '../common/constants/errors';
import { AppException } from '../common/exceptions/app.exception';
import { mapServiceCategories } from '../common/utils/service-category.util';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateExpertProfileDto } from '../users/dto/update-expert-profile.dto';
import { UsersRepository } from '../users/users.repository';

import { ExpertProfileRequestDto } from './dto/expert-profile-request.dto';
import { ExpertProfilesRepository } from './expert-profiles.repository';

import type { ExpertProfileWithRelations } from './expert-profiles.types';

function mapProfile(profile: ExpertProfileWithRelations) {
  return {
    ...profile,
    specialtyCategories: mapServiceCategories(profile.specialtyCategories),
    techStacks: profile.techStacks.map((ts) => ({ name: ts.techStack.name })),
  };
}

@Injectable()
export class ExpertProfilesService {
  constructor(
    private readonly expertProfilesRepository: ExpertProfilesRepository,
    private readonly usersRepository: UsersRepository,
    private readonly prisma: PrismaService,
  ) {}

  async createExpertProfile(userId: string, dto: ExpertProfileRequestDto) {
    const existing = await this.expertProfilesRepository.findByUserId(userId);
    if (existing) {
      throw new AppException(EXPERT_PROFILE_ERRORS.ALREADY_EXISTS);
    }

    if (dto.specialtyCategories.length > 0) {
      const groupNames = new Set(dto.specialtyCategories.map((c) => c.group));
      if (groupNames.size > 1) {
        throw new AppException(EXPERT_PROFILE_ERRORS.MIXED_SERVICE_GROUP);
      }
    }

    const { user, profile } = await this.prisma.$transaction(async (tx) => {
      const user = await this.usersRepository.update(
        userId,
        {
          region: dto.region,
          phoneNumber: dto.phoneNumber,
          bankName: dto.bankName,
          bankAccount: dto.bankAccount,
        },
        tx,
      );
      const profile = await this.expertProfilesRepository.create(
        userId,
        {
          businessName: dto.businessName,
          businessNumber: dto.businessNumber,
          ceoName: dto.ceoName,
          contactTimeStart: dto.contactTimeStart,
          contactTimeEnd: dto.contactTimeEnd,
          foundedYear: Number.parseInt(dto.foundedYear, 10),
          employeeMin: dto.employeeMin,
          employeeMax: dto.employeeMax,
          description: dto.description,
          specialtyCategories: dto.specialtyCategories,
          techStackNames: dto.techStackNames,
        },
        tx,
      );
      return { user, profile };
    });

    return {
      region: user.region,
      phoneNumber: user.phoneNumber,
      bankName: user.bankName,
      bankAccount: user.bankAccount,
      expertProfile: mapProfile(profile),
    };
  }

  async updateExpertProfile(userId: string, dto: UpdateExpertProfileDto) {
    const existing = await this.usersRepository.findByIdWithProfiles(userId);
    if (!existing) throw new AppException(USER_ERRORS.NOT_FOUND);

    if (dto.specialtyCategories && dto.specialtyCategories.length > 0) {
      const groups = new Set(dto.specialtyCategories.map((c) => c.group));
      if (groups.size > 1)
        throw new AppException(EXPERT_PROFILE_ERRORS.MIXED_SERVICE_GROUP);
    }

    const profile = await (existing.expertProfile
      ? this.expertProfilesRepository.update(userId, {
          businessName: dto.businessName,
          businessNumber: dto.businessNumber,
          ceoName: dto.ceoName,
          contactTimeStart: dto.contactTimeStart,
          contactTimeEnd: dto.contactTimeEnd,
          foundedYear:
            dto.foundedYear === undefined
              ? undefined
              : Number.parseInt(dto.foundedYear, 10),
          employeeMin: dto.employeeMin,
          employeeMax: dto.employeeMax,
          description: dto.description,
          specialtyCategories: dto.specialtyCategories,
          techStackNames: dto.techStackNames,
        })
      : this.expertProfilesRepository.create(userId, {
          businessName: dto.businessName,
          businessNumber: dto.businessNumber,
          ceoName: dto.ceoName,
          contactTimeStart: dto.contactTimeStart,
          contactTimeEnd: dto.contactTimeEnd,
          foundedYear:
            dto.foundedYear === undefined
              ? undefined
              : Number.parseInt(dto.foundedYear, 10),
          employeeMin: dto.employeeMin,
          employeeMax: dto.employeeMax,
          description: dto.description,
          specialtyCategories: dto.specialtyCategories,
          techStackNames: dto.techStackNames,
        }));

    return mapProfile(profile);
  }

  async applyForApproval(userId: string) {
    const profile =
      await this.expertProfilesRepository.findByUserIdWithRelations(userId);
    if (profile === null)
      throw new AppException(EXPERT_PROFILE_ERRORS.NOT_FOUND);
    if (profile.isApproved)
      throw new AppException(EXPERT_PROFILE_ERRORS.ALREADY_APPROVED);
    if (profile.isApplied)
      throw new AppException(EXPERT_PROFILE_ERRORS.ALREADY_APPLIED);

    const isComplete =
      profile.businessName !== null &&
      profile.businessNumber !== null &&
      profile.ceoName !== null &&
      profile.contactTimeStart !== null &&
      profile.contactTimeEnd !== null &&
      profile.foundedYear !== null &&
      profile.employeeMin !== null &&
      profile.employeeMax !== null &&
      profile.description !== null &&
      profile.specialtyCategories.length > 0 &&
      profile.techStacks.length > 0 &&
      profile.portfolios.length > 0;

    if (!isComplete)
      throw new AppException(EXPERT_PROFILE_ERRORS.INCOMPLETE_PROFILE);

    const updated =
      await this.expertProfilesRepository.applyForApproval(userId);
    return mapProfile(updated);
  }
}
