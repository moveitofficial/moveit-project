import { ApiProperty } from '@nestjs/swagger';
import { BusinessSector, StackType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsString,
  IsUrl,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator';

export class PortfolioImageRequestDto {
  @ApiProperty({ example: 'https://example.com/image.png' })
  @IsUrl()
  declare imgUrl: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  declare isMain: boolean;
}

export class PortfolioSkillRequestDto {
  @ApiProperty({ example: 'React' })
  @IsString()
  @Length(1, 20)
  declare stackName: string;

  @ApiProperty({ enum: StackType, example: StackType.FRONTEND })
  @IsEnum(StackType)
  declare stackType: StackType;
}

export class PortfolioRequestDto {
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  @IsUUID()
  declare portfolioId: string;

  @ApiProperty({ example: '코드잇 포트폴리오' })
  @IsString()
  @Length(2, 20)
  declare title: string;

  @ApiProperty({
    example:
      '고품질의 IT 코칭 서비스를 제공하는 전문 플랫폼으로, 다양한 요구에 맞춘 맞춤형 솔루션을 제공합니다.',
  })
  @IsString()
  @Length(1, 500)
  declare description: string;

  @ApiProperty({ example: '코드잇' })
  @IsString()
  @Length(2, 20)
  declare clientName: string;

  @ApiProperty({ enum: BusinessSector, example: BusinessSector.ECOMMERCE })
  @IsEnum(BusinessSector)
  declare businessSector: BusinessSector;

  @ApiProperty({
    type: [PortfolioImageRequestDto],
    example: [
      { imgUrl: 'https://example.com/main.png', isMain: true },
      { imgUrl: 'https://example.com/detail.png', isMain: false },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PortfolioImageRequestDto)
  declare images: PortfolioImageRequestDto[];

  @ApiProperty({
    type: [PortfolioSkillRequestDto],
    example: [
      { stackName: 'Figma', stackType: StackType.DESIGN },
      { stackName: 'React', stackType: StackType.FRONTEND },
      { stackName: 'NestJS', stackType: StackType.BACKEND },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PortfolioSkillRequestDto)
  declare skills: PortfolioSkillRequestDto[];
}
