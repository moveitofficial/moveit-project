import { ApiProperty, OmitType } from '@nestjs/swagger';
import { BusinessSector, StackType } from '@prisma/client';

class PortfolioImageResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ example: 'https://exampleImgUrl.com' })
  declare imgUrl: string;

  @ApiProperty({ example: true })
  declare isMain: boolean;
}

class PortfolioSkillResponseDto {
  @ApiProperty({ example: 'NEST' })
  declare stackName: string;

  @ApiProperty({ enum: StackType, example: StackType.BACKEND })
  declare stackType: StackType;
}

class PortfolioCreateImageResponseDto extends OmitType(
  PortfolioImageResponseDto,
  ['id'] as const,
) {}

class PortfolioBaseResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ format: 'uuid' })
  declare expertProfileId: string;

  @ApiProperty({ example: '우리 동네 제휴 멤버십 서비스' })
  declare title: string;

  @ApiProperty({ example: '포트폴리오 서비스에 대한 설명을 위한 문장입니다.' })
  declare description: string;

  @ApiProperty({ example: '한준유니버스' })
  declare clientName: string;

  @ApiProperty({
    enum: BusinessSector,
    example: BusinessSector.PUBLIC_INSTITUTION,
  })
  declare businessSector: BusinessSector;

  @ApiProperty({ example: '2025-05-20T00:00:00.000Z' })
  declare createdAt: Date;

  @ApiProperty({ example: '2025-05-20T00:00:00.000Z' })
  declare updatedAt: Date;
}

export class PortfolioResponseDto extends PortfolioBaseResponseDto {
  @ApiProperty({ type: [PortfolioImageResponseDto] })
  declare images: PortfolioImageResponseDto[];

  @ApiProperty({ type: [PortfolioSkillResponseDto] })
  declare skills: PortfolioSkillResponseDto[];
}

export class PortfolioCreateResponseDto extends PortfolioBaseResponseDto {
  @ApiProperty({ type: [PortfolioCreateImageResponseDto] })
  declare images: PortfolioCreateImageResponseDto[];

  @ApiProperty({ type: [PortfolioSkillResponseDto] })
  declare skills: PortfolioSkillResponseDto[];
}
