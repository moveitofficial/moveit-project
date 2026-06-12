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
  @ApiPropertyOptional({
    format: 'uuid',
    description: '이미지 업로드 시 발급받은 신고 ID',
  })
  @IsOptional()
  @IsUUID()
  declare reportId?: string;

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
    example: '욕설과 비방을 일삼고 있습니다.',
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
  @ArrayMaxSize(3)
  @IsUrl({}, { each: true })
  declare imageUrls?: string[];
}
