import { Injectable } from '@nestjs/common';

import { CLIENT_PROFILE_ERRORS } from '../common/constants/errors';
import { AppException } from '../common/exceptions/app.exception';
import { PrismaService } from '../prisma/prisma.service';

import { ClientProfilesRepository } from './client-profiles.repository';
import { CreateClientProfileDto } from './dto/create-client-profile.dto';

@Injectable()
export class ClientProfilesService {
  constructor(
    private readonly clientProfilesRepository: ClientProfilesRepository,
    private readonly prisma: PrismaService,
  ) {}

  async createClientProfile(userId: string, dto: CreateClientProfileDto) {
    const existing = await this.clientProfilesRepository.findByUserId(userId);
    if (existing) {
      throw new AppException(CLIENT_PROFILE_ERRORS.ALREADY_EXISTS);
    }

    if (dto.interestCategories && dto.interestCategories.length > 0) {
      const groupIds = new Set(
        dto.interestCategories.map((c) => c.serviceGroupId),
      );
      if (groupIds.size > 1) {
        throw new AppException(CLIENT_PROFILE_ERRORS.MIXED_SERVICE_GROUP);
      }
    }

    return this.prisma.$transaction(async (tx) => {
      if (
        dto.region !== undefined ||
        dto.phoneNumber !== undefined ||
        dto.bankName !== undefined ||
        dto.bankAccount !== undefined
      ) {
        await tx.user.update({
          where: { id: userId },
          data: {
            region: dto.region,
            phoneNumber: dto.phoneNumber,
            bankName: dto.bankName,
            bankAccount: dto.bankAccount,
          },
        });
      }

      return tx.clientProfile.create({
        data: {
          userId,
          nickname: dto.nickname,
          interestCategories: {
            create:
              dto.interestCategories?.map((c) => ({
                serviceGroupId: c.serviceGroupId,
                serviceCategoryId: c.serviceCategoryId,
              })) ?? [],
          },
        },
        include: { interestCategories: true },
      });
    });
  }
}
