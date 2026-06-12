import { Body, Controller, HttpStatus, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAccessUser } from '../auth/jwt/jwt-access.strategy';
import {
  COMMON_ERRORS,
  REPORT_ERRORS,
  USER_ERRORS,
} from '../common/constants/errors';
import { ApiErrorResponse } from '../common/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from '../common/decorators/api-success-response.decorator';
import { JwtAuth } from '../common/decorators/jwt-auth.decorator';

import { ReportsRequestDto } from './dto/reports-request.dto';
import { ReportsResponseDto } from './dto/reports-response.dto';
import { ReportsService } from './reports.service';

import type { Request } from 'express';

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @ApiOperation({ summary: '신고 생성' })
  @JwtAuth()
  @ApiSuccessResponse(HttpStatus.CREATED, ReportsResponseDto)
  @ApiErrorResponse(REPORT_ERRORS.SELF_REPORT, COMMON_ERRORS.VALIDATION_ERROR)
  @ApiErrorResponse(USER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(USER_ERRORS.DELETED, REPORT_ERRORS.FORBIDDEN_SAME_ROLE)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Post()
  createReport(@Req() req: Request, @Body() dto: ReportsRequestDto) {
    const user = req.user as JwtAccessUser;
    return this.reportsService.createReport(user.userId, user.role, dto);
  }
}
