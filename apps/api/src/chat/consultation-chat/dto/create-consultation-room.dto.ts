import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class ChatFileAttachmentDto {
  @ApiProperty({ example: 'consultation/uuid/file.pdf' })
  @IsString()
  declare key: string;

  @ApiProperty({
    example:
      'https://bucket.s3.region.amazonaws.com/consultation/uuid/file.pdf',
  })
  @IsString()
  declare url: string;

  @ApiProperty({ example: '기획서.pdf' })
  @IsString()
  declare fileName: string;

  @ApiProperty({ example: 'application/pdf' })
  @IsString()
  declare fileType: string;

  @ApiProperty({ example: 204_800 })
  @IsInt()
  @Min(0)
  declare fileSize: number;
}

export class CreateConsultationRoomDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  declare expertUserId: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  declare serviceId: string;

  @ApiProperty({ example: '안녕하세요, 문의드립니다.' })
  @IsString()
  @IsNotEmpty()
  declare content: string;

  @ApiPropertyOptional({
    type: String,
    format: 'uuid',
    description: '파일 업로드(/consultation/rooms/new/upload) 시 반환된 roomId',
  })
  @IsOptional()
  @IsUUID()
  declare roomId: string | undefined;

  @ApiPropertyOptional({ type: [ChatFileAttachmentDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatFileAttachmentDto)
  declare files: ChatFileAttachmentDto[] | undefined;
}
