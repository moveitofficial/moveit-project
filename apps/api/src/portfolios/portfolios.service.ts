import { Injectable } from '@nestjs/common';
import { StackType } from '@prisma/client';

import { PORTFOLIO_ERRORS } from '../common/constants/errors';
import { AppException } from '../common/exceptions/app.exception';
import { toListResponse } from '../common/utils/list-response.util';
import { ExpertProfilesRepository } from '../expert-profiles/expert-profiles.repository';
import { UploadService } from '../upload/upload.service';

import { PortfoliosRepository } from './portfolios.repository';

import type {
  PortfolioRequestDto,
  PortfolioUpdateDto,
} from './dto/portfolio-request.dto';
import type {
  PortfolioListItem,
  PortfolioWithRelations,
} from './portfolios.types';

//GET 응답용 — image id 포함 (개별 삭제 시 필요). findOneById에 적용해서 사용.
function mapPortfolio(portfolio: PortfolioWithRelations) {
  return {
    ...portfolio,
    images: portfolio.images.map(({ id, imgUrl, isMain }) => ({
      id,
      imgUrl,
      isMain,
    })),
    skills: portfolio.skills.map(({ stackName, stackType }) => ({
      stackName,
      stackType,
    })),
  };
}

function mapPortfolioListItem(portfolio: PortfolioListItem) {
  return {
    id: portfolio.id,
    title: portfolio.title,
    thumbnailUrl: portfolio.images[0]?.imgUrl ?? null,
  };
}

// CREATE 응답용 — image id 불필요
function mapPortfolioCreate(portfolio: PortfolioWithRelations) {
  return {
    ...portfolio,
    images: portfolio.images.map(({ imgUrl, isMain }) => ({
      imgUrl,
      isMain,
    })),
    skills: portfolio.skills.map(({ stackName, stackType }) => ({
      stackName,
      stackType,
    })),
  };
}

@Injectable()
export class PortfoliosService {
  constructor(
    private readonly portfoliosRepository: PortfoliosRepository,
    private readonly expertProfilesRepository: ExpertProfilesRepository,
    private readonly uploadService: UploadService,
  ) {}

  async findManyByExpertProfileId(expertProfileId: string) {
    const portfolios =
      await this.portfoliosRepository.findManyByExpertProfileId(
        expertProfileId,
      );

    return toListResponse(portfolios.map((p) => mapPortfolioListItem(p)));
  }

  async findOneById(id: string) {
    const portfolio = await this.portfoliosRepository.findById(id);

    if (portfolio === null) {
      throw new AppException(PORTFOLIO_ERRORS.NOT_FOUND);
    }
    return mapPortfolio(portfolio);
  }

  async create(userId: string, dto: PortfolioRequestDto) {
    const mainImages = dto.images.filter((img) => img.isMain);
    if (mainImages.length !== 1) {
      throw new AppException(PORTFOLIO_ERRORS.MAIN_IMAGE_REQUIRED);
    }

    const detailImages = dto.images.filter((img) => !img.isMain);
    if (detailImages.length === 0 || detailImages.length > 10) {
      throw new AppException(PORTFOLIO_ERRORS.DETAIL_IMAGE_INVALID);
    }

    const skillStackTypes = new Set(dto.skills.map((s) => s.stackType));
    for (const type of Object.values(StackType)) {
      if (!skillStackTypes.has(type)) {
        throw new AppException(PORTFOLIO_ERRORS.MISSING_STACK_TYPE);
      }
    }

    let expertProfile =
      await this.expertProfilesRepository.findByUserId(userId);
    expertProfile ??= await this.expertProfilesRepository.create(userId, {});

    const portfolio = await this.portfoliosRepository.create({
      id: dto.portfolioId,
      expertProfileId: expertProfile.id,
      title: dto.title,
      description: dto.description,
      clientName: dto.clientName,
      businessSector: dto.businessSector,
      images: dto.images,
      skills: dto.skills,
    });

    return mapPortfolioCreate(portfolio);
  }

  async update(portfolioId: string, userId: string, dto: PortfolioUpdateDto) {
    const portfolio = await this.portfoliosRepository.findByIdAndUserId(
      portfolioId,
      userId,
    );

    if (!portfolio) {
      const exists = await this.portfoliosRepository.findById(portfolioId);
      throw new AppException(
        exists ? PORTFOLIO_ERRORS.FORBIDDEN : PORTFOLIO_ERRORS.NOT_FOUND,
      );
    }

    if (dto.images !== undefined) {
      const mainImages = dto.images.filter((img) => img.isMain);
      if (mainImages.length !== 1) {
        throw new AppException(PORTFOLIO_ERRORS.MAIN_IMAGE_REQUIRED);
      }
      const detailImages = dto.images.filter((img) => !img.isMain);
      if (detailImages.length === 0 || detailImages.length > 10) {
        throw new AppException(PORTFOLIO_ERRORS.DETAIL_IMAGE_INVALID);
      }
    }

    if (dto.skills !== undefined) {
      const skillStackTypes = new Set(dto.skills.map((s) => s.stackType));
      for (const type of Object.values(StackType)) {
        if (!skillStackTypes.has(type)) {
          throw new AppException(PORTFOLIO_ERRORS.MISSING_STACK_TYPE);
        }
      }
    }

    const oldImageKeys =
      dto.images === undefined
        ? []
        : portfolio.images.map((img) => new URL(img.imgUrl).pathname.slice(1));

    const updated = await this.portfoliosRepository.update({
      id: portfolioId,
      title: dto.title,
      description: dto.description,
      clientName: dto.clientName,
      businessSector: dto.businessSector,
      images: dto.images,
      skills: dto.skills,
    });

    if (oldImageKeys.length > 0) {
      await this.uploadService.deleteImages(oldImageKeys);
    }

    return mapPortfolio(updated);
  }

  async delete(portfolioId: string, userId: string): Promise<void> {
    const portfolio = await this.portfoliosRepository.findByIdAndUserId(
      portfolioId,
      userId,
    );

    if (!portfolio) {
      const exists = await this.portfoliosRepository.findById(portfolioId);
      throw new AppException(
        exists ? PORTFOLIO_ERRORS.FORBIDDEN : PORTFOLIO_ERRORS.NOT_FOUND,
      );
    }

    const keys = portfolio.images.map((img) =>
      new URL(img.imgUrl).pathname.slice(1),
    );
    await this.uploadService.deleteImages(keys);
    await this.portfoliosRepository.deleteById(portfolioId);
  }
}
