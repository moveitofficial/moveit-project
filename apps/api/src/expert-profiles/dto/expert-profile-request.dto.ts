import { ApiProperty } from '@nestjs/swagger';
import {
  Region,
  ServiceCategoryName,
  ServiceGroupName,
  TechStackName,
} from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsString,
  Length,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';

class SpecialtyCategoryDto {
  @ApiProperty({
    enum: ServiceGroupName,
    example: ServiceGroupName.IT_COACHING,
  })
  @IsEnum(ServiceGroupName)
  declare group: ServiceGroupName;

  @ApiProperty({ enum: ServiceCategoryName, example: ServiceCategoryName.WEB })
  @IsEnum(ServiceCategoryName)
  declare category: ServiceCategoryName;
}

export class ExpertProfileRequestDto {
  @ApiProperty({ example: '코드잇 에이전시' })
  @IsString()
  @Length(2, 50)
  declare businessName: string;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  @Matches(/^\d{10}$/, { message: '사업자 번호는 10자리 숫자여야 합니다.' })
  declare businessNumber: string;

  @ApiProperty({ example: '김코드' })
  @IsString()
  @Length(2, 20)
  declare ceoName: string;

  @ApiProperty({ example: '09:00' })
  @Matches(/^([01]\d|2[0-3]):00$/, {
    message: '정시 단위로 입력해주세요. (예: 09:00)',
  })
  declare contactTimeStart: string;

  @ApiProperty({ example: '18:00' })
  @Matches(/^([01]\d|2[0-3]):00$/, {
    message: '정시 단위로 입력해주세요. (예: 18:00)',
  })
  declare contactTimeEnd: string;

  @ApiProperty({ example: '202101' })
  @IsString()
  @Matches(/^(19|20)\d{2}(0[1-9]|1[0-2])$/, {
    message: '설립 연월은 YYYYMM 형식이어야 합니다. (예: 202101)',
  })
  declare foundedYear: string;

  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(1)
  declare employeeMin: number;

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(1)
  declare employeeMax: number;

  @ApiProperty({ example: '안녕하세요 코드잇 에이전시입니다.' })
  @IsString()
  @Length(1, 500)
  declare description: string;

  @ApiProperty({ enum: Region, example: Region.SEOUL })
  @IsEnum(Region)
  declare region: Region;

  @ApiProperty({ example: '01012345678' })
  @IsString()
  @Matches(/^01[0-9]\d{7,8}$/, {
    message: '올바른 휴대폰 번호 형식이 아닙니다.',
  })
  declare phoneNumber: string;

  @ApiProperty({ example: '카카오뱅크' })
  @IsString()
  @Length(2, 20)
  declare bankName: string;

  @ApiProperty({ example: '3333123456789' })
  @IsString()
  @Matches(/^\d+$/, { message: '계좌번호는 숫자만 입력할 수 있습니다.' })
  @Length(10, 20)
  declare bankAccount: string;

  @ApiProperty({ type: [SpecialtyCategoryDto] })
  @IsArray()
  @ArrayMinSize(1, { message: '전문 분야를 1개 이상 선택해주세요.' })
  @ArrayMaxSize(3, { message: '전문 분야는 최대 3개까지 선택할 수 있습니다.' })
  @ValidateNested({ each: true })
  @Type(() => SpecialtyCategoryDto)
  declare specialtyCategories: SpecialtyCategoryDto[];

  @ApiProperty({
    enum: TechStackName,
    isArray: true,
    example: [TechStackName.TYPESCRIPT, TechStackName.REACT],
  })
  @IsArray()
  @ArrayMinSize(1, { message: '보유 기술을 1개 이상 선택해주세요.' })
  @ArrayMaxSize(5, { message: '보유 기술은 최대 5개까지 선택할 수 있습니다.' })
  @IsEnum(TechStackName, { each: true })
  declare techStackNames: TechStackName[];
}
