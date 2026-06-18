import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// 게시글/댓글의 노출 상태 (노출중 / 본인 삭제 / 관리자 삭제)
export const COMMUNITY_DELETION_STATUSES = [
  'VISIBLE',
  'USER_DELETED',
  'ADMIN_DELETED',
] as const;

export type CommunityDeletionStatus =
  (typeof COMMUNITY_DELETION_STATUSES)[number];

// deletedAt + deletedByAdminId 두 필드를 보고 노출 상태 값을 만들어주는 함수
// (게시글/댓글 둘 다에서 사용)
export const deriveDeletionStatus = (
  deletedAt: Date | null,
  deletedByAdminId: string | null,
): CommunityDeletionStatus => {
  if (!deletedAt) return 'VISIBLE';
  return deletedByAdminId ? 'ADMIN_DELETED' : 'USER_DELETED';
};

export class UserPostItemDto {
  @ApiProperty({
    format: 'uuid',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  declare id: string;

  @ApiProperty({ example: '프로팀의 앱개발 센스있는 디자인+개발 합니다.' })
  declare title: string;

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
