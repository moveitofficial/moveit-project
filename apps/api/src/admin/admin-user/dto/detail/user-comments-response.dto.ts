import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  COMMUNITY_DELETION_STATUSES,
  type CommunityDeletionStatus,
} from './user-posts-response.dto';

export class UserCommentItemDto {
  @ApiProperty({
    format: 'uuid',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  declare id: string;

  @ApiProperty({ example: '프로팀의 앱개발 센스있는 디자인+개발 합니다.' })
  declare content: string;

  @ApiProperty({ enum: COMMUNITY_DELETION_STATUSES, example: 'VISIBLE' })
  declare status: CommunityDeletionStatus;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    nullable: true,
    description: '삭제 일시(null이면 노출중)',
  })
  declare deletedAt: Date | null;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    description: '삭제한 관리자 이름 (관리자 삭제 시에만)',
    example: '코드잇 관리자',
  })
  declare deletedByAdminName: string | null;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2026-03-04T00:00:00.000Z',
  })
  declare createdAt: Date;
}
