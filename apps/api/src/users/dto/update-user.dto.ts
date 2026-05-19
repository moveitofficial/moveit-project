import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  Region,
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
  Max,
  Min,
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

export class UpdateUserDto {
  // 공통 유저 필드
  @ApiPropertyOptional({ enum: Region, example: Region.SEOUL })
  @IsOptional()
  @IsEnum(Region)
  region?: Region;

  @ApiPropertyOptional({ example: '01012345678' })
  @IsOptional()
  @IsString()
  @Matches(/^01[0-9]\d{7,8}$/, {
    message: '올바른 휴대폰 번호 형식이 아닙니다.',
  })
  phoneNumber?: string;

  @ApiPropertyOptional({ example: '카카오뱅크' })
  @IsOptional()
  @IsString()
  @Length(2, 20)
  bankName?: string;

  @ApiPropertyOptional({ example: '3333123456789' })
  @IsOptional()
  @IsString()
  @Matches(/^\d+$/, { message: '계좌번호는 숫자만 입력할 수 있습니다.' })
  @Length(10, 20)
  bankAccount?: string;

  // 의뢰인 프로필 필드
  @ApiPropertyOptional({ example: '한준님축지법쓰신다' })
  @IsOptional()
  @IsString()
  @Length(2, 20)
  nickname?: string;

  @ApiPropertyOptional({ type: [UpdateInterestCategoryDto] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(3, { message: '관심 분야는 최대 3개까지 선택할 수 있습니다.' })
  @ValidateNested({ each: true })
  @Type(() => UpdateInterestCategoryDto)
  interestCategories?: UpdateInterestCategoryDto[];

  // 전문가 프로필 필드
  @ApiPropertyOptional({ example: '코드잇 에이전시' })
  @IsOptional()
  @IsString()
  @Length(2, 50)
  businessName?: string;

  @ApiPropertyOptional({ example: '1234567890' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{10}$/, { message: '사업자 번호는 10자리 숫자여야 합니다.' })
  businessNumber?: string;

  @ApiPropertyOptional({ example: '김코드' })
  @IsOptional()
  @IsString()
  @Length(2, 20)
  ceoName?: string;

  @ApiPropertyOptional({ example: 'AM 09:00' })
  @IsOptional()
  @IsString()
  contactTimeStart?: string;

  @ApiPropertyOptional({ example: 'PM 06:00' })
  @IsOptional()
  @IsString()
  contactTimeEnd?: string;

  @ApiPropertyOptional({ example: 2021 })
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  foundedYear?: number;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  employeeMin?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  employeeMax?: number;

  @ApiPropertyOptional({ example: '안녕하세요 코드잇 에이전시입니다.' })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  description?: string;

  @ApiPropertyOptional({ type: [UpdateSpecialtyCategoryDto] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(3, { message: '전문 분야는 최대 3개까지 선택할 수 있습니다.' })
  @ValidateNested({ each: true })
  @Type(() => UpdateSpecialtyCategoryDto)
  specialtyCategories?: UpdateSpecialtyCategoryDto[];

  @ApiPropertyOptional({
    enum: TechStackName,
    isArray: true,
    example: [TechStackName.TYPESCRIPT, TechStackName.REACT],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(TechStackName, { each: true })
  techStackNames?: TechStackName[];
}
