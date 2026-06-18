import { randomUUID } from 'node:crypto';

import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAccessUser } from '../auth/jwt/jwt-access.strategy';
import {
  COMMON_ERRORS,
  REPORT_ERRORS,
  UPLOAD_ERRORS,
  USER_ERRORS,
} from '../common/constants/errors';
import { ApiErrorResponse } from '../common/decorators/api-error-response.decorator';
import { ApiFileBody } from '../common/decorators/api-file-body.decorator';
import { ApiSuccessResponse } from '../common/decorators/api-success-response.decorator';
import { JwtAuth } from '../common/decorators/jwt-auth.decorator';
import { UploadReportImagesResponseDto } from '../upload/dto/upload-response.dto';
import { UploadService } from '../upload/upload.service';

import { ReportsRequestDto } from './dto/reports-request.dto';
import { ReportsResponseDto } from './dto/reports-response.dto';
import { ReportsService } from './reports.service';

import type { Request } from 'express';

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly uploadService: UploadService,
  ) {}

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

  @ApiOperation({ summary: '신고 이미지 업로드' })
  @JwtAuth()
  @ApiConsumes('multipart/form-data')
  @ApiFileBody([{ name: 'reportImages', multiple: true }])
  @ApiSuccessResponse(HttpStatus.CREATED, UploadReportImagesResponseDto)
  @ApiErrorResponse(
    UPLOAD_ERRORS.FILE_NOT_ATTACHED,
    UPLOAD_ERRORS.REPORT_IMAGES_TOO_MANY,
    UPLOAD_ERRORS.INVALID_FILE_TYPE,
    UPLOAD_ERRORS.REPORT_IMAGE_TOO_LARGE,
  )
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Post('upload')
  @UseInterceptors(FilesInterceptor('reportImages', 3))
  async uploadReportImages(
    @UploadedFiles() files: Express.Multer.File[] | undefined,
  ) {
    const reportId = randomUUID();
    const reportImages = await this.uploadService.uploadReportImages(
      files,
      `reports/${reportId}`,
    );

    return { reportId, images: reportImages };
  }
}
