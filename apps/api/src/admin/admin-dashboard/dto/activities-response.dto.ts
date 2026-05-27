import { ApiProperty } from '@nestjs/swagger';
import { AdminActionType } from '@prisma/client';

import { PaginationDto } from '../../../common/dto/pagination-response.dto';

export class ActivityItemDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({
    enum: AdminActionType,
    example: AdminActionType.EXPERT_APPROVED,
  })
  declare actionType: AdminActionType;

  @ApiProperty({
    format: 'uuid',
    nullable: true,
    description: '행동 대상 ID (대상 종류는 actionType으로 판별)',
  })
  declare referenceId: string | null;

  @ApiProperty({
    example: '김지훈',
    nullable: true,
    description:
      '행동 대상의 표시명 (USER 액션 → user.name, FAQ 액션 → faq.title). 그 외 액션은 null',
  })
  declare targetName: string | null;

  @ApiProperty({ example: '무빗 최고관리자' })
  declare adminName: string;

  @ApiProperty({ example: '2026-05-27T05:02:46.228Z' })
  declare createdAt: Date;
}

export class ActivitiesResponseDataDto {
  @ApiProperty({ type: [ActivityItemDto] })
  declare items: ActivityItemDto[];

  @ApiProperty({ type: PaginationDto })
  declare pagination: PaginationDto;
}
