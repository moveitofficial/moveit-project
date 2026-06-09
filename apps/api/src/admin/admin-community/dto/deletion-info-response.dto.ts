import { ApiProperty } from '@nestjs/swagger';

export class DeletionInfoResponseDto {
  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2026-05-01T00:00:00.000Z',
  })
  declare deletedAt: Date;

  @ApiProperty({ example: '코드잇 관리자' })
  declare deletedByAdminName: string;

  @ApiProperty({
    example: '부적절한 글이 포함되어 있어서 삭제 하였습니다.',
  })
  declare deleteReason: string;
}
