import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import sharp from 'sharp';

import { S3Service } from '../s3/s3.service';

const PORTFOLIO_MIN_WIDTH = 600;
const PORTFOLIO_MAX_HEIGHT = 3000;
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly s3Service: S3Service) {}

  @Post('portfolio')
  @ApiOperation({ summary: '포트폴리오 이미지 업로드' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPortfolio(
    @UploadedFile() file: Express.Multer.File | undefined,
  ): Promise<{ key: string; url: string }> {
    if (!file) {
      throw new BadRequestException('파일이 첨부되지 않았습니다.');
    }

    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      throw new BadRequestException(
        `허용되지 않는 파일 형식입니다. (받은 형식: ${file.mimetype})`,
      );
    }

    const { width, height } = await sharp(file.buffer).metadata();
    if (!width || !height) {
      throw new BadRequestException(
        '이미지 메타데이터를 읽을 수 없습니다. 손상된 파일일 수 있습니다.',
      );
    }
    if (width < PORTFOLIO_MIN_WIDTH) {
      throw new BadRequestException(
        `가로는 최소 ${PORTFOLIO_MIN_WIDTH.toString()}px 이상이어야 합니다. (현재: ${width.toString()}px)`,
      );
    }
    if (height > PORTFOLIO_MAX_HEIGHT) {
      throw new BadRequestException(
        `세로는 최대 ${PORTFOLIO_MAX_HEIGHT.toString()}px 이하여야 합니다. (현재: ${height.toString()}px)`,
      );
    }

    return this.s3Service.upload({
      buffer: file.buffer,
      folder: 'portfolios',
      contentType: file.mimetype,
      originalName: file.originalname,
    });
  }
}
