import { ApiPropertyOptional } from '@nestjs/swagger';
import { ReportReason } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class GetReportsQueryDto {
  @ApiPropertyOptional({
    enum: ReportReason,
    description:
      '신고 사유 필터 (FALSE_INFORMATION / ABUSE / ILLEGAL_ACTIVITY / EXTERNAL_CONTACT / SPAM / OTHER)',
  })
  @IsOptional()
  @IsEnum(ReportReason)
  declare reason: ReportReason | undefined;

  @ApiPropertyOptional({
    type: String,
    example: 'DevLydia',
    description: '신고자/대상의 이름 또는 회사명 부분 일치 (대소문자 무시)',
  })
  @IsOptional()
  @IsString()
  declare search: string | undefined;

  @ApiPropertyOptional({ type: Number, example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  declare page: number | undefined;

  @ApiPropertyOptional({ type: Number, example: 50, default: 50, maximum: 500 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(500)
  declare pageSize: number | undefined;
}
