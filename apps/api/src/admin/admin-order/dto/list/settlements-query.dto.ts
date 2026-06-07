import { ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

const SETTLEMENT_STATUSES = [
  OrderStatus.SETTLEMENT_REQUESTED,
  OrderStatus.SETTLEMENT_COMPLETED,
] as const;

export type SettlementStatus = (typeof SETTLEMENT_STATUSES)[number];

export class GetSettlementsQueryDto {
  @ApiPropertyOptional({
    enum: SETTLEMENT_STATUSES,
    description:
      '정산 상태 필터 — SETTLEMENT_REQUESTED=정산요청, SETTLEMENT_COMPLETED=정산완료. 미지정 시 둘 다',
  })
  @IsOptional()
  @IsIn(SETTLEMENT_STATUSES)
  declare status: SettlementStatus | undefined;

  @ApiPropertyOptional({
    type: String,
    example: '조한준',
    description: '구매자 이름 부분 일치 (대소문자 무시)',
  })
  @IsOptional()
  @IsString()
  declare search: string | undefined;

  @ApiPropertyOptional({ type: Number, example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  declare page: number | undefined;

  @ApiPropertyOptional({ type: Number, example: 50, default: 50, maximum: 500 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(500)
  declare pageSize: number | undefined;
}
