import { Injectable } from '@nestjs/common';

import { EXPERT_PROFILE_ERRORS } from '../common/constants/errors';
import { AppException } from '../common/exceptions/app.exception';
import { mapServiceCategories } from '../common/utils/service-category.util';
import { PrismaService } from '../prisma/prisma.service';
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

    if (dto.specialtyCategories && dto.specialtyCategories.length > 0) {
      const groupNames = new Set(dto.specialtyCategories.map((c) => c.group));
      if (groupNames.size > 1) {
        throw new AppException(EXPERT_PROFILE_ERRORS.MIXED_SERVICE_GROUP);
      }
    }

    const hasUserFields =
      dto.region !== undefined ||
      dto.phoneNumber !== undefined ||
      dto.bankName !== undefined ||
      dto.bankAccount !== undefined;

    const profile = await this.prisma.$transaction(async (tx) => {
      if (hasUserFields) {
        await this.usersRepository.update(
          userId,
          {
            region: dto.region,
            phoneNumber: dto.phoneNumber,
            bankName: dto.bankName,
            bankAccount: dto.bankAccount,
          },
          tx,
        );
      }
      return this.expertProfilesRepository.create(
        userId,
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
    });

    return mapProfile(profile);
  }
}
