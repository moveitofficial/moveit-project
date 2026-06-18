import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  COMMON_ERRORS,
  STATISTICS_ERRORS,
} from '../../common/constants/errors';
import { ApiErrorResponse } from '../../common/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from '../../common/decorators/api-success-response.decorator';
import { AdminJwtAuth } from '../admin-auth/jwt/admin-jwt-auth.decorator';

import { AdminStatisticsService } from './admin-statistics.service';
import { StatisticsQueryDto } from './dto/statistics-query.dto';
import { StatisticsResponseDto } from './dto/statistics-response.dto';

@ApiTags('admin-statistics')
@Controller('admin/statistics')
export class AdminStatisticsController {
  constructor(
    private readonly adminStatisticsService: AdminStatisticsService,
  ) {}

  @ApiOperation({ summary: '어드민 판매 통계 조회' })
  @ApiSuccessResponse(HttpStatus.OK, StatisticsResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(STATISTICS_ERRORS.INVALID_DATE_RANGE)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @AdminJwtAuth()
  @Get()
  getSalesStatistics(
    @Query() query: StatisticsQueryDto,
  ): Promise<StatisticsResponseDto> {
    return this.adminStatisticsService.getSalesStatistics(query);
  }
}
