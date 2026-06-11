import { Injectable } from '@nestjs/common';
import sharp from 'sharp';

import { UPLOAD_ERRORS } from '../common/constants/errors';
import { AppException } from '../common/exceptions/app.exception';
import { S3Service } from '../s3/s3.service';

const MIN_WIDTH = 600;
const MAX_HEIGHT = 3000;
const PROFILE_MAX_SIZE = 500;
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_CHAT_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'application/pdf',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);
const CHAT_FILE_MAX_SIZE = 500 * 1024 * 1024;
const CHAT_FILES_MAX_COUNT = 3;

@Injectable()
export class UploadService {
  constructor(private readonly s3Service: S3Service) {}

  async uploadImage(
    file: Express.Multer.File | undefined,
    folder: string,
  ): Promise<{ key: string; url: string }> {
    if (!file) {
      throw new AppException(UPLOAD_ERRORS.FILE_NOT_ATTACHED);
    }

    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      throw new AppException(UPLOAD_ERRORS.INVALID_FILE_TYPE);
    }

    const { width, height } = await sharp(file.buffer).metadata();
    if (!width || !height) {
      throw new AppException(UPLOAD_ERRORS.IMAGE_METADATA_UNREADABLE);
    }
    if (width > PROFILE_MAX_SIZE || height > PROFILE_MAX_SIZE) {
      throw new AppException(UPLOAD_ERRORS.PROFILE_IMAGE_TOO_LARGE);
    }

    return this.s3Service.upload({
      buffer: file.buffer,
      folder,
      contentType: file.mimetype,
      originalName: file.originalname,
    });
  }

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

  async uploadChatFiles(
    files: Express.Multer.File[] | undefined,
    folder: string,
  ): Promise<
    {
      key: string;
      url: string;
      fileName: string;
      fileType: string;
      fileSize: number;
    }[]
  > {
    if (!files || files.length === 0) {
      throw new AppException(UPLOAD_ERRORS.FILE_NOT_ATTACHED);
    }
    if (files.length > CHAT_FILES_MAX_COUNT) {
      throw new AppException(UPLOAD_ERRORS.CHAT_FILES_TOO_MANY);
    }
    return Promise.all(
      files.map(async (file) => {
        if (!ALLOWED_CHAT_MIME_TYPES.has(file.mimetype)) {
          throw new AppException(UPLOAD_ERRORS.INVALID_CHAT_FILE_TYPE);
        }
        if (file.size > CHAT_FILE_MAX_SIZE) {
          throw new AppException(UPLOAD_ERRORS.CHAT_FILE_TOO_LARGE);
        }
        const result = await this.s3Service.upload({
          buffer: file.buffer,
          folder,
          contentType: file.mimetype,
          originalName: file.originalname,
        });
        return {
          ...result,
          fileName: file.originalname,
          fileType: file.mimetype,
          fileSize: file.size,
        };
      }),
    );
  }

  async uploadChatFile(
    file: Express.Multer.File | undefined,
    folder: string,
  ): Promise<{
    key: string;
    url: string;
    fileName: string;
    fileType: string;
    fileSize: number;
  }> {
    if (!file) {
      throw new AppException(UPLOAD_ERRORS.FILE_NOT_ATTACHED);
    }
    if (!ALLOWED_CHAT_MIME_TYPES.has(file.mimetype)) {
      throw new AppException(UPLOAD_ERRORS.INVALID_CHAT_FILE_TYPE);
    }
    if (file.size > CHAT_FILE_MAX_SIZE) {
      throw new AppException(UPLOAD_ERRORS.CHAT_FILE_TOO_LARGE);
    }
    const result = await this.s3Service.upload({
      buffer: file.buffer,
      folder,
      contentType: file.mimetype,
      originalName: file.originalname,
    });
    return {
      ...result,
      fileName: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size,
    };
  }

  async deleteImages(keys: string[]): Promise<void> {
    await Promise.all(keys.map((key) => this.s3Service.delete(key)));
  }

  async uploadBannerImage(
    file: Express.Multer.File | undefined,
  ): Promise<{ key: string; url: string }> {
    if (!file) {
      throw new AppException(UPLOAD_ERRORS.FILE_NOT_ATTACHED);
    }

    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      throw new AppException(UPLOAD_ERRORS.INVALID_FILE_TYPE);
    }

    return this.s3Service.upload({
      buffer: file.buffer,
      folder: 'banners',
      contentType: file.mimetype,
      originalName: file.originalname,
    });
  }
}
