import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MainSectionType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

const SORT_OPTIONS = ['sales', 'created'] as const;
type SortOption = (typeof SORT_OPTIONS)[number];

export class GetCandidatesQueryDto {
  @ApiProperty({
    enum: MainSectionType,
    example: MainSectionType.POPULAR_IT_COACHING,
    description: '섹션 타입 (서비스 또는 전문가 섹션)',
  })
  @IsEnum(MainSectionType)
  declare sectionType: MainSectionType;

  @ApiPropertyOptional({
    type: String,
    example: '안드로이드',
    description:
      '검색 (서비스 모달: 서비스명, 전문가 모달: 회사명). 부분 일치, 대소문자 무시',
  })
  @IsOptional()
  @IsString()
  declare search: string | undefined;

  @ApiPropertyOptional({
    enum: SORT_OPTIONS,
    default: 'sales',
    description: 'sales=판매량 desc, created=등록일/가입일 desc',
  })
  @IsOptional()
  @IsIn(SORT_OPTIONS)
  declare sort: SortOption | undefined;

  @ApiPropertyOptional({ type: Number, example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  declare page: number | undefined;

  @ApiPropertyOptional({ type: Number, example: 20, default: 20, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  declare pageSize: number | undefined;
}
