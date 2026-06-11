import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReportReason } from '@prisma/client';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class ReportsRequestDto {
  @ApiProperty({
    format: 'uuid',
    description: '신고 대상 유저 ID',
  })
  @IsUUID()
  declare reportedUserId: string;

  @ApiProperty({
    enum: ReportReason,
    example: ReportReason.ABUSE,
    description: '신고 사유',
  })
  @IsEnum(ReportReason)
  declare reason: ReportReason;

  @ApiProperty({
    description: '신고 상세 내용',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  declare detail: string;

  @ApiPropertyOptional({
    type: [String],
    example: ['https://example.com/reports.png'],
    description: '이미지 URL 목록',
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5)
  @IsUrl({}, { each: true })
  declare imageUrls?: string[];
}
