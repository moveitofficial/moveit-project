import { ApiProperty } from '@nestjs/swagger';
import { Region, ServiceCategoryName, ServiceGroupName } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsString,
  Length,
  Matches,
  ValidateNested,
} from 'class-validator';

class InterestCategoryDto {
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

export class ClientProfileRequestDto {
  @ApiProperty({ example: '한준님축지법쓰신다' })
  @IsString()
  @Length(2, 10)
  @Matches(/^[가-힣a-zA-Z0-9_]+$/, {
    message: '닉네임은 한글, 영문, 숫자, 언더바(_)만 사용할 수 있습니다.',
  })
  declare nickname: string;

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

  @ApiProperty({ type: [InterestCategoryDto] })
  @IsArray()
  @ArrayMinSize(1, { message: '관심 분야를 1개 이상 선택해주세요.' })
  @ArrayMaxSize(3, { message: '관심 분야는 최대 3개까지 선택할 수 있습니다.' })
  @ValidateNested({ each: true })
  @Type(() => InterestCategoryDto)
  declare interestCategories: InterestCategoryDto[];
}
