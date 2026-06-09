import { Injectable } from '@nestjs/common';

import { FAQ_ERRORS } from '../../common/constants/errors';
import { AppException } from '../../common/exceptions/app.exception';
import { toPaginatedResponse } from '../../common/utils/list-response.util';

import { AdminFaqRepository } from './admin-faq.repository';

import type { CreateFaqDto } from './dto/create-request.dto';
import type { DeleteFaqDto } from './dto/delete-request.dto';
import type { FaqListItemDto } from './dto/list-response.dto';
import type { PageQueryDto } from './dto/page-query.dto';
import type { UpdateFaqDto } from './dto/update-request.dto';
import type { Paginated } from '../../common/types/paginated.type';

const PAGE_SIZE = 10;

@Injectable()
export class AdminFaqService {
  constructor(private readonly adminFaqRepository: AdminFaqRepository) {}

  async getAll(query: PageQueryDto): Promise<Paginated<FaqListItemDto>> {
    const page = query.page ?? 1;
    const skip = (page - 1) * PAGE_SIZE;

    const [rows, totalCount] = await Promise.all([
      this.adminFaqRepository.findAll(skip, PAGE_SIZE),
      this.adminFaqRepository.count(),
    ]);

    return toPaginatedResponse(rows, {
      page,
      pageSize: PAGE_SIZE,
      totalCount,
    });
  }

  async create(dto: CreateFaqDto, adminId: string): Promise<void> {
    await this.adminFaqRepository.createFaq({
      data: { title: dto.title, content: dto.content },
      adminId,
    });
  }

  async update(id: string, dto: UpdateFaqDto, adminId: string): Promise<void> {
    if (dto.title === undefined && dto.content === undefined) {
      throw new AppException(FAQ_ERRORS.NOTHING_TO_UPDATE);
    }

    const existing = await this.adminFaqRepository.findById(id);
    if (!existing) {
      throw new AppException(FAQ_ERRORS.NOT_FOUND);
    }

    await this.adminFaqRepository.updateFaq({
      id,
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.content !== undefined && { content: dto.content }),
      },
      adminId,
    });
  }

  async delete(dto: DeleteFaqDto, adminId: string): Promise<void> {
    const existingIds = await this.adminFaqRepository.findIdsByIds(dto.ids);
    if (existingIds.length !== dto.ids.length) {
      throw new AppException(FAQ_ERRORS.NOT_FOUND);
    }

    await this.adminFaqRepository.deleteFaqs({
      ids: dto.ids,
      adminId,
    });
  }
}
