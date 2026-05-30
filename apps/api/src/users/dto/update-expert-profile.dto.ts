import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  ServiceCategoryName,
  ServiceGroupName,
  TechStackName,
} from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';

class UpdateSpecialtyCategoryDto {
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

export class UpdateExpertProfileDto {
  @ApiPropertyOptional({ example: '코드잇 에이전시' })
  @IsOptional()
  @IsString()
  @Length(2, 50)
  declare businessName?: string;

  @ApiPropertyOptional({ example: '1234567890' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{10}$/, { message: '사업자 번호는 10자리 숫자여야 합니다.' })
  declare businessNumber?: string;

  @ApiPropertyOptional({ example: '김코드' })
  @IsOptional()
  @IsString()
  @Length(2, 20)
  declare ceoName?: string;

  @ApiPropertyOptional({ example: '09:00' })
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):00$/, {
    message: '정시 단위로 입력해주세요. (예: 09:00)',
  })
  declare contactTimeStart?: string;

  @ApiPropertyOptional({ example: '18:00' })
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):00$/, {
    message: '정시 단위로 입력해주세요. (예: 18:00)',
  })
  declare contactTimeEnd?: string;

  @ApiPropertyOptional({ example: '202101' })
  @IsOptional()
  @IsString()
  @Matches(/^(19|20)\d{2}(0[1-9]|1[0-2])$/, {
    message: '설립 연월은 YYYYMM 형식이어야 합니다. (예: 202101)',
  })
  declare foundedYear?: string;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  declare employeeMin?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  declare employeeMax?: number;

  @ApiPropertyOptional({ example: '안녕하세요 코드잇 에이전시입니다.' })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  declare description?: string;

  @ApiPropertyOptional({ type: [UpdateSpecialtyCategoryDto] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(3, { message: '전문 분야는 최대 3개까지 선택할 수 있습니다.' })
  @ValidateNested({ each: true })
  @Type(() => UpdateSpecialtyCategoryDto)
  declare specialtyCategories?: UpdateSpecialtyCategoryDto[];

  @ApiPropertyOptional({
    enum: TechStackName,
    isArray: true,
    example: [TechStackName.TYPESCRIPT, TechStackName.REACT],
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5, { message: '보유 기술은 최대 5개까지 선택할 수 있습니다.' })
  @IsEnum(TechStackName, { each: true })
  declare techStackNames?: TechStackName[];
}
