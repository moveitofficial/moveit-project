import { ApiProperty } from '@nestjs/swagger';
import {
  Region,
  ServiceCategoryName,
  ServiceGroupName,
  ServiceStatus,
  TechStackName,
} from '@prisma/client';

class FavoriteServiceExpertSummaryResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ example: '코드잇 에이전시' })
  declare companyName: string;

  @ApiProperty({ nullable: true })
  declare profileImageUrl: string | null;

  @ApiProperty({ enum: Region, nullable: true, example: Region.SEOUL })
  declare region: Region | null;
}

class FavoriteServiceCategoryRefResponseDto {
  @ApiProperty({
    enum: ServiceGroupName,
    example: ServiceGroupName.IT_COACHING,
  })
  declare group: ServiceGroupName;

  @ApiProperty({ enum: ServiceCategoryName, example: ServiceCategoryName.WEB })
  declare category: ServiceCategoryName;
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

  @ApiProperty({ type: FavoriteServiceCategoryRefResponseDto })
  declare categoryRef: FavoriteServiceCategoryRefResponseDto;

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

  @ApiProperty({ example: 45 })
  declare favoriteCount: number;
}
