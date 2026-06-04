import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AuthProvider, CommunityCategory, Region, Role } from '@prisma/client';

import { ClientProfileResponseDto } from '../../client-profiles/dto/client-profile-response.dto';
import { ExpertProfileResponseDto } from '../../expert-profiles/dto/expert-profile-response.dto';

export class UserResponseDto {
  @ApiProperty({ example: '246f7925-b83c-4b14-b34d-07009d711301' })
  declare id: string;

  @ApiProperty({ example: 'user@example.com' })
  declare email: string;

  @ApiPropertyOptional({ example: '킹한준' })
  declare name: string | null;

  @ApiProperty({ enum: AuthProvider, example: AuthProvider.LOCAL })
  declare provider: AuthProvider;

  @ApiPropertyOptional({ example: null })
  declare providerId: string | null;

  @ApiProperty({ enum: Role, example: Role.CLIENT })
  declare role: Role;

  @ApiPropertyOptional({ example: 'https://example.com/image.png' })
  declare profileImageUrl: string | null;

  @ApiProperty({ example: false })
  declare isBlocked: boolean;

  @ApiProperty({ example: null })
  declare blockedAt: Date | null;

  @ApiProperty({ example: false })
  declare isDeleted: boolean;

  @ApiPropertyOptional({ example: null })
  declare deletedAt: Date | null;

  @ApiPropertyOptional({ example: null })
  declare deletionReason: string | null;

  @ApiPropertyOptional({ enum: Region, example: Region.SEOUL })
  declare region: Region | null;

  @ApiPropertyOptional({ example: '카카오뱅크' })
  declare bankName: string | null;

  @ApiPropertyOptional({ example: '3333123456789' })
  declare bankAccount: string | null;

  @ApiPropertyOptional({ example: '01012345678' })
  declare phoneNumber: string | null;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  declare createdAt: Date;
}

export class ClientUserResponseDto extends UserResponseDto {
  @ApiPropertyOptional({ type: ClientProfileResponseDto, nullable: true })
  declare clientProfile: ClientProfileResponseDto | null;
}

export class ExpertUserResponseDto extends UserResponseDto {
  @ApiPropertyOptional({ type: ExpertProfileResponseDto, nullable: true })
  declare expertProfile: ExpertProfileResponseDto | null;
}

export class MyPostListItemResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ enum: CommunityCategory })
  declare category: CommunityCategory;

  @ApiProperty({ example: '이 문제 어떻게 해결하나요?' })
  declare title: string;

  @ApiProperty({ example: '본문 내용' })
  declare content: string;

  @ApiProperty({ example: '2026-06-02T10:00:00.000Z' })
  declare createdAt: string;

  @ApiProperty({ example: '코드잇' })
  declare authorDisplayName: string;

  @ApiProperty({ example: 12 })
  declare likeCount: number;

  @ApiProperty({ example: 3 })
  declare commentCount: number;
class MyCommentPostSummaryDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;
  @ApiProperty({ enum: CommunityCategory })
  declare category: CommunityCategory;
  @ApiProperty({ example: '이 문제 어떻게 해결하나요?' })
  declare title: string;
  @ApiProperty({ example: 12 })
  declare likeCount: number;
}
export class MyCommentListItemResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;
  @ApiProperty({ example: '댓글 내용입니다.' })
  declare content: string;
  @ApiProperty({ example: '2026-06-02T10:00:00.000Z' })
  declare createdAt: string;
  @ApiProperty({ type: MyCommentPostSummaryDto })
  declare post: MyCommentPostSummaryDto;
}
