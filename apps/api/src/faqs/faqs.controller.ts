import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { COMMON_ERRORS, FAQ_ERRORS } from '../common/constants/errors';
import { ApiErrorResponse } from '../common/decorators/api-error-response.decorator';
import {
  ApiPaginatedResponse,
  ApiSuccessResponse,
} from '../common/decorators/api-success-response.decorator';

import { FaqListQueryDto } from './dto/faq-list-query.dto';
import { FaqResponseDto } from './dto/faq-response.dto';
import { FaqsService } from './faqs.service';

@ApiTags('faqs')
@Controller('faqs')
export class FaqsController {
  constructor(private readonly faqService: FaqsService) {}

  @ApiOperation({ summary: 'FAQ 목록 조회' })
  @ApiPaginatedResponse(HttpStatus.OK, FaqResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.VALIDATION_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Get()
  findAll(@Query() query: FaqListQueryDto) {
    return this.faqService.getFaqs(query);
  }

  @ApiOperation({ summary: 'FAQ 상세 조회' })
  @ApiSuccessResponse(HttpStatus.OK, FaqResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.VALIDATION_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @ApiErrorResponse(FAQ_ERRORS.NOT_FOUND)
  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.faqService.getFaqById(id);
  }
}
