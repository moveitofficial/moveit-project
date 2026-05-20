import { Injectable } from '@nestjs/common';

import { EXPERT_PROFILE_ERRORS } from '../common/constants/errors';
import { AppException } from '../common/exceptions/app.exception';
import { ExpertProfilesRepository } from '../expert-profiles/expert-profiles.repository';

import { PortfoliosRepository } from './portfolios.repository';

import type { PortfolioRequestDto } from '../users/dto/portfolio-request.dto';

@Injectable()
export class PortfoliosService {
  constructor(
    private readonly portfoliosRepository: PortfoliosRepository,
    private readonly expertProfilesRepository: ExpertProfilesRepository,
  ) {}

  findOneById(id: string) {
    return this.portfoliosRepository.findById(id);
  }

  async create(userId: string, dto: PortfolioRequestDto) {
    const expertProfile =
      await this.expertProfilesRepository.findByUserId(userId);
    if (!expertProfile) {
      throw new AppException(EXPERT_PROFILE_ERRORS.NOT_FOUND);
    }

    return this.portfoliosRepository.create({
      expertProfileId: expertProfile.id,
      title: dto.title,
      description: dto.description,
      clientName: dto.clientName,
      businessSector: dto.businessSector,
      images: dto.images,
      skills: dto.skills,
    });
  }
}
