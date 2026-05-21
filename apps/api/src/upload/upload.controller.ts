import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { COMMON_ERRORS, UPLOAD_ERRORS } from '../common/constants/errors';
import { ApiErrorResponse } from '../common/decorators/api-error-response.decorator';
import { RoleAuth } from '../common/decorators/jwt-auth.decorator';

import { UploadService } from './upload.service';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiOperation({ summary: '포트폴리오 이미지 업로드' })
  @RoleAuth(Role.EXPERT)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: { type: 'array', items: { type: 'string', format: 'binary' } },
      },
    },
  })
  @ApiErrorResponse(
    UPLOAD_ERRORS.FILE_NOT_ATTACHED,
    UPLOAD_ERRORS.INVALID_FILE_TYPE,
    UPLOAD_ERRORS.IMAGE_METADATA_UNREADABLE,
    UPLOAD_ERRORS.PORTFOLIO_IMAGE_WIDTH_TOO_SMALL,
    UPLOAD_ERRORS.PORTFOLIO_IMAGE_HEIGHT_TOO_LARGE,
  )
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Post('portfolios')
  @UseInterceptors(FilesInterceptor('files', 11))
  uploadPortfolios(@UploadedFiles() files: Express.Multer.File[] | undefined) {
    return this.uploadService.uploadPortfolioImages(files);
  }
}
