import { randomUUID } from 'node:crypto';

import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import {
  COMMON_ERRORS,
  PORTFOLIO_ERRORS,
  UPLOAD_ERRORS,
} from '../common/constants/errors';
import { ApiErrorResponse } from '../common/decorators/api-error-response.decorator';
import { ApiFileBody } from '../common/decorators/api-file-body.decorator';
import { ApiSuccessResponse } from '../common/decorators/api-success-response.decorator';
import { RoleAuth } from '../common/decorators/jwt-auth.decorator';
import { UploadImagesResponseDto } from '../upload/dto/upload-response.dto';
import { UploadService } from '../upload/upload.service';

import { PortfolioResponseDto } from './dto/portfolio-response.dto';
import { PortfoliosService } from './portfolios.service';

@ApiTags('portfolios')
@Controller('portfolios')
export class PortfoliosController {
  constructor(
    private readonly portfoliosService: PortfoliosService,
    private readonly uploadService: UploadService,
  ) {}

  @ApiOperation({ summary: '포트폴리오 조회' })
  @ApiSuccessResponse(HttpStatus.OK, PortfolioResponseDto)
  @ApiErrorResponse(PORTFOLIO_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Get(':id')
  getPortfolioDetailById(@Param('id') id: string) {
    return this.portfoliosService.findOneById(id);
  }

  @ApiOperation({ summary: '포트폴리오 이미지 업로드' })
  @RoleAuth(Role.EXPERT)
  @ApiConsumes('multipart/form-data')
  @ApiFileBody([
    { name: 'mainImage' },
    { name: 'detailImages', multiple: true },
  ])
  @ApiSuccessResponse(HttpStatus.CREATED, UploadImagesResponseDto)
  @ApiErrorResponse(
    UPLOAD_ERRORS.FILE_NOT_ATTACHED,
    UPLOAD_ERRORS.INVALID_FILE_TYPE,
    UPLOAD_ERRORS.IMAGE_METADATA_UNREADABLE,
    UPLOAD_ERRORS.IMAGE_WIDTH_TOO_SMALL,
    UPLOAD_ERRORS.IMAGE_HEIGHT_TOO_LARGE,
  )
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'mainImage', maxCount: 1 },
      { name: 'detailImages', maxCount: 10 },
    ]),
  )
  async uploadPortfolioImages(
    @UploadedFiles()
    files:
      | {
          mainImage?: Express.Multer.File[];
          detailImages?: Express.Multer.File[];
        }
      | undefined,
  ) {
    const portfolioId = randomUUID();
    const [mainImage, detailImages] = await Promise.all([
      this.uploadService.uploadImages(
        files?.mainImage,
        `portfolios/${portfolioId}`,
      ),
      this.uploadService.uploadImages(
        files?.detailImages,
        `portfolios/${portfolioId}`,
      ),
    ]);
    return { portfolioId, mainImage: mainImage[0], detailImages };
  }
}
