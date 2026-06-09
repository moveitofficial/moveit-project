import { ApiProperty } from '@nestjs/swagger';
import { ServiceGroupName, ServiceStatus } from '@prisma/client';

export class CategoryFeaturedItemDto {
  @ApiProperty({ format: 'uuid', description: '삭제 시 식별자' })
  declare categoryFeaturedId: string;

  @ApiProperty({ format: 'uuid' })
  declare serviceId: string;

  @ApiProperty({ example: '안드로이드 / IOS 앱 개발 React Native' })
  declare title: string;

  @ApiProperty({ enum: ServiceGroupName })
  declare category: ServiceGroupName;

  @ApiProperty({ type: String, nullable: true, example: '코드잇에이전시' })
  declare businessName: string | null;

  @ApiProperty({ enum: ServiceStatus, example: ServiceStatus.ACTIVE })
  declare status: ServiceStatus;

  @ApiProperty({ example: 380_000 })
  declare servicePrice: number;

  @ApiProperty({ type: String, format: 'date-time' })
  declare createdAt: Date;

  @ApiProperty({ example: 10 })
  declare orderCount: number;
}

export class CategoryFeaturedPageResponseDto {
  @ApiProperty({ type: [CategoryFeaturedItemDto] })
  declare itCoaching: CategoryFeaturedItemDto[];

  @ApiProperty({ type: [CategoryFeaturedItemDto] })
  declare projectRequest: CategoryFeaturedItemDto[];
}
