import { ApiPropertyOptional } from '@nestjs/swagger';
import { Region } from '@prisma/client';
import { IsEnum, IsOptional, IsString, Length, Matches } from 'class-validator';

export class UpdateUserDto {
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
}
