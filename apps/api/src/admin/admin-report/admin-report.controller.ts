import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { COMMON_ERRORS, REPORT_ERRORS } from '../../common/constants/errors';
import { ApiErrorResponse } from '../../common/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from '../../common/decorators/api-success-response.decorator';
import { AppException } from '../../common/exceptions/app.exception';
import { AdminJwtAccessGuard } from '../admin-auth/jwt/admin-jwt-access.guard';

import { AdminReportService } from './admin-report.service';
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
}
