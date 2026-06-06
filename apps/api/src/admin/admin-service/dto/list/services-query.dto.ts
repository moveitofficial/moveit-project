import { ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceGroupName, ServiceStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class GetServicesQueryDto {
  @ApiPropertyOptional({
    enum: ServiceGroupName,
    description: '카테고리 그룹 필터 (IT_COACHING / PROJECT_REQUEST)',
  })
  @IsOptional()
  @IsEnum(ServiceGroupName)
  declare categoryGroup: ServiceGroupName | undefined;

  @ApiPropertyOptional({
    enum: ServiceStatus,
    description:
      '상태 필터 — ACTIVE=판매중, PAUSED=판매중지, CLOSED=삭제(소프트딜리트)',
  })
  @IsOptional()
  @IsEnum(ServiceStatus)
  declare status: ServiceStatus | undefined;

  @ApiPropertyOptional({
    type: String,
    example: '안드로이드',
    description: '서비스명 부분 일치 (대소문자 무시)',
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
