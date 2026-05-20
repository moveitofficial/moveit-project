import { ApiProperty } from '@nestjs/swagger';
import { BusinessSector, StackType } from '@prisma/client';

class PortfolioImageResponseDto {
  @ApiProperty()
  declare id: string;

  @ApiProperty({ example: 'https://example.com/image.png' })
  declare imgUrl: string;

  @ApiProperty({ example: false })
  declare isMain: boolean;
}

class PortfolioSkillResponseDto {
  @ApiProperty()
  declare id: string;

  @ApiProperty({ example: 'React' })
  declare stackName: string;

  @ApiProperty({ enum: StackType, example: StackType.FRONTEND })
  declare stackType: StackType;
}

export class PortfolioResponseDto {
  @ApiProperty()
  declare id: string;

  @ApiProperty({ example: '코드잇 포트폴리오' })
  declare title: string;

  @ApiProperty({ example: '고품질의 IT 코칭 서비스를 제공합니다.' })
  declare description: string;

  @ApiProperty({ example: '코드잇' })
  declare clientName: string;

  @ApiProperty({ enum: BusinessSector, example: BusinessSector.ECOMMERCE })
  declare businessSector: BusinessSector;

  @ApiProperty({ type: [PortfolioImageResponseDto] })
  declare images: PortfolioImageResponseDto[];

  @ApiProperty({ type: [PortfolioSkillResponseDto] })
  declare skills: PortfolioSkillResponseDto[];

  @ApiProperty()
  declare createdAt: Date;

  @ApiProperty()
  declare updatedAt: Date;
}
