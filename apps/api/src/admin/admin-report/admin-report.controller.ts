import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { COMMON_ERRORS, REPORT_ERRORS } from '../../common/constants/errors';
import { ApiErrorResponse } from '../../common/decorators/api-error-response.decorator';
import {
  ApiPaginatedResponse,
  ApiSuccessResponse,
} from '../../common/decorators/api-success-response.decorator';
import { AppException } from '../../common/exceptions/app.exception';
import { Paginated } from '../../common/types/paginated.type';
import { AdminJwtAccessGuard } from '../admin-auth/jwt/admin-jwt-access.guard';

import { AdminReportService } from './admin-report.service';
import { GetReportsQueryDto } from './dto/list/reports-query.dto';
import { ReportItemDto } from './dto/list/reports-response.dto';
import { ReportDetailResponseDto } from './dto/report-detail-response.dto';
@ApiTags('admin-report')
@Controller('admin/reports')
export class AdminReportController {
  constructor(private readonly adminReportService: AdminReportService) {}

  @ApiOperation({ summary: '[어드민] 신고 상세 조회' })
  @ApiSuccessResponse(HttpStatus.OK, ReportDetailResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(REPORT_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @Get(':reportId')
  getReportDetail(
    @Param(
      'reportId',
      new ParseUUIDPipe({
        exceptionFactory: () => new AppException(REPORT_ERRORS.NOT_FOUND),
      }),
    )
    reportId: string,
  ): Promise<ReportDetailResponseDto> {
    return this.adminReportService.getReportDetail(reportId);
  }

  @ApiOperation({
    summary: '[어드민] 전체 신고 리스트',
    description:
      '전체 신고 내역. 사유(reason) 필터, 검색은 신고자/대상의 이름·회사명 OR 부분 일치, 최근 신고 순.',
  })
  @ApiPaginatedResponse(HttpStatus.OK, ReportItemDto)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @Get()
  getReports(
    @Query() query: GetReportsQueryDto,
  ): Promise<Paginated<ReportItemDto>> {
    return this.adminReportService.getReports(query);
  }
}
