import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Region } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  ValidateNested,
} from 'class-validator';

class InterestCategoryDto {
  @ApiProperty({ example: '2b25c45a-5c87-4caa-8872-34b501452c23' })
  @IsUUID()
  declare serviceGroupId: string;

  @ApiProperty({ example: 'b3e57c2a-e64b-47c7-99dd-a174ca2d4dac' })
  @IsUUID()
  declare serviceCategoryId: string;
}

export class ClientProfileRequestDto {
  @ApiPropertyOptional({ example: '한준님축지법쓰신다' })
  @IsOptional()
  @IsString()
  @Length(2, 10)
  @Matches(/^[가-힣a-zA-Z0-9_]+$/, {
    message: '닉네임은 한글, 영문, 숫자, 언더바(_)만 사용할 수 있습니다.',
  })
  nickname?: string;

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

  @ApiPropertyOptional({ type: [InterestCategoryDto] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(3, { message: '관심 분야는 최대 3개까지 선택할 수 있습니다.' })
  @ValidateNested({ each: true })
  @Type(() => InterestCategoryDto)
  interestCategories?: InterestCategoryDto[];
}
