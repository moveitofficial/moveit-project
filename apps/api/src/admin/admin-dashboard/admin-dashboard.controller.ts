import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { COMMON_ERRORS } from '../../common/constants/errors';
import { ApiErrorResponse } from '../../common/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from '../../common/decorators/api-success-response.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { AdminJwtAccessGuard } from '../admin-auth/jwt/admin-jwt-access.guard';

import { AdminDashboardService } from './admin-dashboard.service';
import { ActivitiesResponseDataDto } from './dto/activities-response.dto';
import { PendingResponseDataDto } from './dto/pending-response.dto';
import { SummaryResponseDataDto } from './dto/summary-response.dto';

@ApiTags('admin-dashboard')
@Controller('admin/dashboard')
export class AdminDashboardController {
  constructor(private readonly adminDashboardService: AdminDashboardService) {}

  @ApiOperation({ summary: '어드민 대시보드 요약 카운트' })
  @ApiSuccessResponse(HttpStatus.OK, SummaryResponseDataDto)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @Get('summary')
  getSummary(): Promise<SummaryResponseDataDto> {
    return this.adminDashboardService.getSummary();
  }

  @ApiOperation({ summary: '어드민 대시보드 처리대기 리스트' })
  @ApiSuccessResponse(HttpStatus.OK, PendingResponseDataDto)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @Get('pending')
  getPending(
    @Query() query: PaginationQueryDto,
  ): Promise<PendingResponseDataDto> {
    return this.adminDashboardService.getPending(query);
  }

  @ApiOperation({ summary: '어드민 최근 활동 로그' })
  @ApiSuccessResponse(HttpStatus.OK, ActivitiesResponseDataDto)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @Get('activities')
  getActivities(
    @Query() query: PaginationQueryDto,
  ): Promise<ActivitiesResponseDataDto> {
    return this.adminDashboardService.getActivities(query);
  }
}
