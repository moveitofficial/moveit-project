import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Region, TechStackName } from '@prisma/client';

export class ExpertDetailResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    example: 'https://example.img.com/image.jpg',
  })
  declare profileImageUrl: string | null;

  @ApiPropertyOptional({ enum: Region, nullable: true, example: Region.SEOUL })
  declare region: Region | null;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    example: '코드잇 에이전시',
  })
  declare businessName: string | null;

  @ApiPropertyOptional({ type: String, nullable: true, example: '김대표' })
  declare ceoName: string | null;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    example: '안녕하세요. 코드잇 에이전시입니다.',
  })
  declare description: string | null;

  @ApiPropertyOptional({ type: Number, nullable: true, example: 2021 })
  declare foundedYear: number | null;

  @ApiPropertyOptional({ type: Number, nullable: true, example: 5 })
  declare employeeMin: number | null;

  @ApiPropertyOptional({ type: Number, nullable: true, example: 10 })
  declare employeeMax: number | null;

  @ApiPropertyOptional({ type: String, nullable: true, example: '09:00' })
  declare contactTimeStart: string | null;

  @ApiPropertyOptional({ type: String, nullable: true, example: '18:00' })
  declare contactTimeEnd: string | null;

  @ApiPropertyOptional({ type: Number, nullable: true, example: 4.9 })
  declare avgRating: number | null;

  @ApiProperty({ example: 350 })
  declare reviewCount: number;

  @ApiProperty({
    enum: TechStackName,
    isArray: true,
    example: [TechStackName.REACT],
  })
  declare techStacks: TechStackName[];

  @ApiProperty({ type: [String], example: ['코드잇', '네이버'] })
  declare clientNames: string[];

  @ApiProperty({ example: 328 })
  declare totalOrderCount: number;

  @ApiProperty({ example: 8 })
  declare serviceCount: number;

  @ApiPropertyOptional({
    type: Number,
    nullable: true,
    example: 80,
    description:
      '활성화 서비스 중 가장 높은 구매율 (%, 반올림, 최대 100). 주문이 없으면 null',
  })
  declare topPurchaseRate: number | null;

  @ApiPropertyOptional({
    type: Number,
    nullable: true,
    example: 100,
    description:
      '완료율 (EXPIRED 제외 주문수 / 전체 주문수 × 100, %). 주문이 없으면 null',
  })
  declare completionRate: number | null;

  @ApiProperty({ example: false })
  declare isFavorite: boolean;
}
