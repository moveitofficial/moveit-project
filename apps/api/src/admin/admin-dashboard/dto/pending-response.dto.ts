import { ApiProperty } from '@nestjs/swagger';

import { PaginationDto } from '../../../common/dto/pagination-response.dto';
import { PendingType } from '../admin-dashboard.types';

export class PendingItemDto {
  @ApiProperty({ enum: PendingType, example: PendingType.EXPERT_APPLICATION })
  declare type: PendingType;

  @ApiProperty({ format: 'uuid', description: '원본 도메인 항목 ID' })
  declare id: string;

  @ApiProperty({ example: '김지훈 판매자 권한 신청' })
  declare content: string;

  @ApiProperty({ example: '김지훈' })
  declare requesterName: string;

  @ApiProperty({ example: '2026-04-20T10:00:00.000Z' })
  declare createdAt: Date;
}

export class PendingResponseDataDto {
  @ApiProperty({ type: [PendingItemDto] })
  declare items: PendingItemDto[];

  @ApiProperty({ type: PaginationDto })
  declare pagination: PaginationDto;
}
