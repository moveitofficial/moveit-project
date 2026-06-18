import { ApiProperty } from '@nestjs/swagger';
import { Region, ServiceStatus, TechStackName } from '@prisma/client';

class FavoriteServiceExpertSummaryResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ example: '코드잇 에이전시' })
  declare companyName: string;

  @ApiProperty({
    description: '프로필 이미지 url',
    nullable: true,
    example: 'https://example.img.com/image.jpg',
  })
  declare profileImageUrl: string | null;

  @ApiProperty({ enum: Region, nullable: true, example: Region.SEOUL })
  declare region: Region | null;
}

export class FavoriteServiceListItemResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ example: '안드로이드 / iOS 앱 개발' })
  declare title: string;

  @ApiProperty({ example: 380_000 })
  declare servicePrice: number;

  @ApiProperty({ example: 30 })
  declare workDuration: number;

  @ApiProperty({ example: 3 })
  declare revisionCount: number;

  @ApiProperty({ example: 'https://...' })
  declare thumbnailUrl: string;

  @ApiProperty({ enum: ServiceStatus })
  declare status: ServiceStatus;

  @ApiProperty({ type: FavoriteServiceExpertSummaryResponseDto })
  declare expert: FavoriteServiceExpertSummaryResponseDto;

  @ApiProperty({
    enum: TechStackName,
    isArray: true,
    example: [TechStackName.REACT],
  })
  declare techStacks: TechStackName[];

  @ApiProperty({ example: 4.9 })
  declare rating: number;

  @ApiProperty({ example: 328 })
  declare reviewCount: number;

  @ApiProperty({ example: 120 })
  declare orderCount: number;
}
