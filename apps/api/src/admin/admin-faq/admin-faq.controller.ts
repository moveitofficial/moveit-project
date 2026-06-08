import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { COMMON_ERRORS, FAQ_ERRORS } from '../../common/constants/errors';
import { ApiErrorResponse } from '../../common/decorators/api-error-response.decorator';
import {
  ApiPaginatedResponse,
  ApiSuccessResponse,
} from '../../common/decorators/api-success-response.decorator';
import { AppException } from '../../common/exceptions/app.exception';
import { AdminJwtAccessGuard } from '../admin-auth/jwt/admin-jwt-access.guard';

import { AdminFaqService } from './admin-faq.service';
import { CreateFaqDto } from './dto/create-request.dto';
import { DeleteFaqDto } from './dto/delete-request.dto';
import { FaqListItemDto } from './dto/list-response.dto';
import { PageQueryDto } from './dto/page-query.dto';
import { UpdateFaqDto } from './dto/update-request.dto';

import type { Paginated } from '../../common/types/paginated.type';
import type { AdminJwtAccessUser } from '../admin-auth/jwt/admin-jwt-access.strategy';
import type { Request } from 'express';

@ApiTags('admin-faq')
@Controller('admin/faqs')
export class AdminFaqController {
  constructor(private readonly adminFaqService: AdminFaqService) {}

  @ApiOperation({
    summary: '[어드민] FAQ 목록',
    description:
      '최신순(createdAt DESC), pageSize 10 고정. 무한스크롤 시 page 증가시키며 호출. content 포함이라 아코디언 펼침에 추가 호출 불필요.',
  })
  @ApiPaginatedResponse(HttpStatus.OK, FaqListItemDto)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @Get()
  getAll(@Query() query: PageQueryDto): Promise<Paginated<FaqListItemDto>> {
    return this.adminFaqService.getAll(query);
  }

  @ApiOperation({
    summary: '[어드민] FAQ 등록',
    description: 'title + content(에디터 HTML, 이미지 제외).',
  })
  @ApiSuccessResponse(HttpStatus.CREATED)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(COMMON_ERRORS.VALIDATION_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() body: CreateFaqDto, @Req() req: Request): Promise<void> {
    const { adminId } = req.user as AdminJwtAccessUser;
    await this.adminFaqService.create(body, adminId);
  }

  @ApiOperation({
    summary: '[어드민] FAQ 수정',
    description: 'title / content 부분 수정. 둘 다 비어 있으면 400.',
  })
  @ApiSuccessResponse(HttpStatus.OK)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(FAQ_ERRORS.NOT_FOUND)
  @ApiErrorResponse(FAQ_ERRORS.NOTHING_TO_UPDATE)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () => new AppException(FAQ_ERRORS.NOT_FOUND),
      }),
    )
    id: string,
    @Body() body: UpdateFaqDto,
    @Req() req: Request,
  ): Promise<void> {
    const { adminId } = req.user as AdminJwtAccessUser;
    await this.adminFaqService.update(id, body, adminId);
  }

  @ApiOperation({
    summary: '[어드민] FAQ 다중 삭제',
    description: '체크박스 다중 선택. ids 중 하나라도 없으면 404.',
  })
  @ApiSuccessResponse(HttpStatus.OK)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(FAQ_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @HttpCode(HttpStatus.OK)
  @Delete()
  async delete(@Body() body: DeleteFaqDto, @Req() req: Request): Promise<void> {
    const { adminId } = req.user as AdminJwtAccessUser;
    await this.adminFaqService.delete(body, adminId);
  }
}
