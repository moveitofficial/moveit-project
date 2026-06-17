import { ApiProperty } from '@nestjs/swagger';

class OrderTabCountsBaseDto {
  @ApiProperty({ example: 11, description: '전체' })
  declare all: number;

  @ApiProperty({
    example: 3,
    description:
      '작업/논의중 (NEGOTIATING + IN_PROGRESS + CANCEL_REQUESTED, 전문가는 DEADLINE_IMMINENT 포함)',
  })
  declare working: number;

  @ApiProperty({ example: 2, description: '작업완료 (WORK_COMPLETED)' })
  declare workCompleted: number;

  @ApiProperty({
    example: 5,
    description: '구매확정 (PURCHASE_CONFIRMED, 의뢰인은 SETTLEMENT 포함)',
  })
  declare purchaseConfirmed: number;

  @ApiProperty({
    example: 1,
    description: '기한만료 (EXPIRED + REFUND_REQUESTED)',
  })
  declare expired: number;

  @ApiProperty({
    example: 1,
    description: '환불·취소 (PAYMENT_CANCELLED + REFUND_COMPLETED)',
  })
  declare cancelRefund: number;
}

export class ClientOrderTabCountsDto extends OrderTabCountsBaseDto {
  @ApiProperty({ example: 5, description: '마감임박 (DEADLINE_IMMINENT)' })
  declare deadlineImminent: number;
}

export class ExpertOrderTabCountsDto extends OrderTabCountsBaseDto {
  @ApiProperty({
    example: 3,
    description: '정산요청/완료 (SETTLEMENT_REQUESTED + SETTLEMENT_COMPLETED)',
  })
  declare settlement: number;
}
