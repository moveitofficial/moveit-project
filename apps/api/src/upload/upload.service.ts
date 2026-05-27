import { Injectable } from '@nestjs/common';
import sharp from 'sharp';

import { UPLOAD_ERRORS } from '../common/constants/errors';
import { AppException } from '../common/exceptions/app.exception';
import { S3Service } from '../s3/s3.service';

const MIN_WIDTH = 600;
const MAX_HEIGHT = 3000;
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

@Injectable()
export class UploadService {
  constructor(private readonly s3Service: S3Service) {}

  // async uploadImage(
  //   file: Express.Multer.File | undefined,
  // ): Promise<{ key: string; url: string }> {
  //   if (!file) {
  //     throw new AppException(UPLOAD_ERRORS.FILE_NOT_ATTACHED);
  //   }

  //   if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
  //     throw new AppException(UPLOAD_ERRORS.INVALID_FILE_TYPE);
  //   }

  //   const { width, height } = await sharp(file.buffer).metadata();
  //   if (!width || !height) {
  //     throw new AppException(UPLOAD_ERRORS.IMAGE_METADATA_UNREADABLE);
  //   }
  //   if (width < MIN_WIDTH) {
  //     throw new AppException(UPLOAD_ERRORS.IMAGE_WIDTH_TOO_SMALL);
  //   }
  //   if (height > MAX_HEIGHT) {
  //     throw new AppException(UPLOAD_ERRORS.IMAGE_HEIGHT_TOO_LARGE);
  //   }

  //   return this.s3Service.upload({
  //     buffer: file.buffer,
  //     folder: 'portfolios',
  //     contentType: file.mimetype,
  //     originalName: file.originalname,
  //   });
  // }

  async uploadImages(
    files: Express.Multer.File[] | undefined,
    folder: string,
  ): Promise<{ key: string; url: string }[]> {
    if (!files || files.length === 0) {
      throw new AppException(UPLOAD_ERRORS.FILE_NOT_ATTACHED);
    }

    return Promise.all(
      files.map(async (file) => {
        if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
          throw new AppException(UPLOAD_ERRORS.INVALID_FILE_TYPE);
        }

        const { width, height } = await sharp(file.buffer).metadata();
        if (!width || !height) {
          throw new AppException(UPLOAD_ERRORS.IMAGE_METADATA_UNREADABLE);
        }
        if (width < MIN_WIDTH) {
          throw new AppException(UPLOAD_ERRORS.IMAGE_WIDTH_TOO_SMALL);
        }
        if (height > MAX_HEIGHT) {
          throw new AppException(UPLOAD_ERRORS.IMAGE_HEIGHT_TOO_LARGE);
        }

        return this.s3Service.upload({
          buffer: file.buffer,
          folder,
          contentType: file.mimetype,
          originalName: file.originalname,
        });
      }),
    );
  }

  async deleteImages(keys: string[]): Promise<void> {
    await Promise.all(keys.map((key) => this.s3Service.delete(key)));
  }
}
