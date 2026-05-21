import { ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceCategoryName, ServiceGroupName } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

class UpdateInterestCategoryDto {
  @ApiPropertyOptional({
    enum: ServiceGroupName,
    example: ServiceGroupName.IT_COACHING,
  })
  @IsEnum(ServiceGroupName)
  declare group: ServiceGroupName;

  @ApiPropertyOptional({
    enum: ServiceCategoryName,
    example: ServiceCategoryName.WEB,
  })
  @IsEnum(ServiceCategoryName)
  declare category: ServiceCategoryName;
}

export class UpdateClientProfileDto {
  @ApiPropertyOptional({ example: '한준님축지법쓰신다' })
  @IsOptional()
  @IsString()
  @Length(2, 20)
  declare nickname?: string;

  @ApiPropertyOptional({ type: [UpdateInterestCategoryDto] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(3, { message: '관심 분야는 최대 3개까지 선택할 수 있습니다.' })
  @ValidateNested({ each: true })
  @Type(() => UpdateInterestCategoryDto)
  declare interestCategories?: UpdateInterestCategoryDto[];
}
