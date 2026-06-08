import { Injectable, NotFoundException } from '@nestjs/common';

import { FAQ_ERRORS } from '../common/constants/errors';
import { Paginated } from '../common/types/paginated.type';
import { toPaginatedResponse } from '../common/utils/list-response.util';

import { FaqListQueryDto } from './dto/faq-list-query.dto';
import { FaqResponseDto } from './dto/faq-response.dto';
import { FaqsRepository } from './faqs.repository';

@Injectable()
export class FaqsService {
  constructor(private readonly faqsRepository: FaqsRepository) {}

  async getFaqs(query: FaqListQueryDto): Promise<Paginated<FaqResponseDto>> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;
    const skip = (page - 1) * pageSize;

    const [faqs, totalCount] = await Promise.all([
      this.faqsRepository.findMany({
        skip,
        take: pageSize,
        search: query.search,
      }),
      this.faqsRepository.count(query.search),
    ]);

    return toPaginatedResponse(
      faqs.map((faq) => this.mapFaq(faq)),
      { page, pageSize, totalCount },
    );
  }

  async getFaqById(id: string): Promise<FaqResponseDto> {
    const faq = await this.faqsRepository.findById(id);

    if (faq === null) {
      throw new NotFoundException(FAQ_ERRORS.NOT_FOUND);
    }

    return this.mapFaq(faq);
  }

  private mapFaq(faq: {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
  }): FaqResponseDto {
    return {
      id: faq.id,
      title: faq.title,
      content: faq.content,
      createdAt: faq.createdAt,
    };
  }
}
