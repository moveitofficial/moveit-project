import { Injectable } from '@nestjs/common';

import { CLIENT_PROFILE_ERRORS } from '../common/constants/errors';
import { AppException } from '../common/exceptions/app.exception';
import { mapServiceCategories } from '../common/utils/service-category.util';
import { PrismaService } from '../prisma/prisma.service';
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

    if (dto.interestCategories && dto.interestCategories.length > 0) {
      const groupNames = new Set(dto.interestCategories.map((c) => c.group));
      if (groupNames.size > 1) {
        throw new AppException(CLIENT_PROFILE_ERRORS.MIXED_SERVICE_GROUP);
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
      return this.clientProfilesRepository.create(
        userId,
        {
          nickname: dto.nickname,
          interestCategories: dto.interestCategories,
        },
        tx,
      );
    });

    return {
      ...profile,
      interestCategories: mapServiceCategories(profile.interestCategories),
    };
  }
}
