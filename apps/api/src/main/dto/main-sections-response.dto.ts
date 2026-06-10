import { ApiProperty } from '@nestjs/swagger';
import { Region, ServiceGroupName, TechStackName } from '@prisma/client';

import { ServiceListItemResponseDto } from '../../services/dto/service-response.dto';

export class MainExpertItemDto {
  @ApiProperty({ format: 'uuid' })
  declare userId: string;

  @ApiProperty({ type: String, nullable: true, example: '전문가1' })
  declare name: string | null;

  @ApiProperty({ type: String, nullable: true, example: '카키쿠키' })
  declare businessName: string | null;

  @ApiProperty({ type: String, nullable: true })
  declare profileImageUrl: string | null;

  @ApiProperty({ enum: Region, nullable: true })
  declare region: Region | null;

  @ApiProperty({ example: 4.9 })
  declare rating: number;

  @ApiProperty({ example: 124 })
  declare reviewCount: number;

  @ApiProperty({ enum: TechStackName, isArray: true })
  declare techStacks: TechStackName[];

  @ApiProperty({ enum: ServiceGroupName, nullable: true })
  declare specialty: ServiceGroupName | null;
}

export class MainBannerDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ example: 'https://cdn.example.com/banner/abc.png' })
  declare imageUrl: string;

  @ApiProperty({ example: 'https://moveit.kr/events/2026-summer' })
  declare actionUrl: string;
}

export class MainSectionsResponseDto {
  @ApiProperty({ type: [ServiceListItemResponseDto] })
  declare popularItCoaching: ServiceListItemResponseDto[];

  @ApiProperty({ type: MainBannerDto, nullable: true })
  declare banner: MainBannerDto | null;

  @ApiProperty({ type: [ServiceListItemResponseDto] })
  declare popularProjectRequest: ServiceListItemResponseDto[];

  @ApiProperty({ type: [MainExpertItemDto] })
  declare moveitPopularProjectExpert: MainExpertItemDto[];

  @ApiProperty({ type: [MainExpertItemDto] })
  declare moveitPopularCoaching: MainExpertItemDto[];

  @ApiProperty({ type: [ServiceListItemResponseDto] })
  declare recommendedItCoaching: ServiceListItemResponseDto[];

  @ApiProperty({ type: [ServiceListItemResponseDto] })
  declare recommendedProjectRequest: ServiceListItemResponseDto[];
}
