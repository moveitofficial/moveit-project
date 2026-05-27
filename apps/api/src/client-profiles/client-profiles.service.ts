import { Injectable } from '@nestjs/common';

import { CLIENT_PROFILE_ERRORS, USER_ERRORS } from '../common/constants/errors';
import { AppException } from '../common/exceptions/app.exception';
import { mapServiceCategories } from '../common/utils/service-category.util';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateClientProfileDto } from '../users/dto/update-client-profile.dto';
import { UsersRepository } from '../users/users.repository';

import { ClientProfilesRepository } from './client-profiles.repository';
import { ClientProfileRequestDto } from './dto/client-profile-request.dto';

@Injectable()
export class ClientProfilesService {
  constructor(
    private readonly clientProfilesRepository: ClientProfilesRepository,
    private readonly usersRepository: UsersRepository,
    private readonly prisma: PrismaService,
  ) {}

  async createClientProfile(userId: string, dto: ClientProfileRequestDto) {
    const existing = await this.clientProfilesRepository.findByUserId(userId);
    if (existing) {
      throw new AppException(CLIENT_PROFILE_ERRORS.ALREADY_EXISTS);
    }

    if (dto.interestCategories.length > 0) {
      const groupNames = new Set(dto.interestCategories.map((c) => c.group));
      if (groupNames.size > 1) {
        throw new AppException(CLIENT_PROFILE_ERRORS.MIXED_SERVICE_GROUP);
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
      const profile = await this.clientProfilesRepository.create(
        userId,
        {
          nickname: dto.nickname,
          interestCategories: dto.interestCategories,
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
      clientProfile: {
        ...profile,
        interestCategories: mapServiceCategories(profile.interestCategories),
      },
    };
  }

  async updateClientProfile(userId: string, dto: UpdateClientProfileDto) {
    const existing = await this.usersRepository.findByIdWithProfiles(userId);
    if (!existing) throw new AppException(USER_ERRORS.NOT_FOUND);

    if (dto.interestCategories && dto.interestCategories.length > 0) {
      const groups = new Set(dto.interestCategories.map((c) => c.group));
      if (groups.size > 1)
        throw new AppException(CLIENT_PROFILE_ERRORS.MIXED_SERVICE_GROUP);
    }

    const profile = await (existing.clientProfile
      ? this.clientProfilesRepository.update(userId, {
          nickname: dto.nickname,
          interestCategories: dto.interestCategories,
        })
      : this.clientProfilesRepository.create(userId, {
          nickname: dto.nickname,
          interestCategories: dto.interestCategories,
        }));

    return {
      ...profile,
      interestCategories: mapServiceCategories(profile.interestCategories),
    };
  }
}
