import { Module } from '@nestjs/common';

import { S3Module } from '../s3/s3.module';

import { UploadService } from './upload.service';

@Module({
  imports: [S3Module],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
