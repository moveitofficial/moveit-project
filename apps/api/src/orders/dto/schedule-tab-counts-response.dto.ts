import { ApiProperty } from '@nestjs/swagger';

export class ScheduleTabCountsResponseDto {
  @ApiProperty({
    example: 11,
    description: '전체 (작업중·완료·마감임박·기한만료 합)',
  })
  declare all: number;

  @ApiProperty({ example: 3, description: '작업중 (IN_PROGRESS)' })
  declare inProgress: number;

  @ApiProperty({ example: 2, description: '완료 (WORK_COMPLETED)' })
  declare workCompleted: number;

  @ApiProperty({ example: 2, description: '마감임박 (DEADLINE_IMMINENT)' })
  declare deadlineImminent: number;

  @ApiProperty({ example: 1, description: '기한만료 (EXPIRED)' })
  declare expired: number;
}
