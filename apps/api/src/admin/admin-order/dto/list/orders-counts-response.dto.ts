import { ApiProperty } from '@nestjs/swagger';

export class OrdersCountsDto {
  @ApiProperty({ example: 11, description: '전체' }) declare all: number;
  @ApiProperty({
    example: 3,
    description: '작업/논의중 (NEGOTIATING + IN_PROGRESS)',
  })
  declare working: number;
  @ApiProperty({ example: 2, description: '작업완료 (WORK_COMPLETED)' })
  declare workCompleted: number;
  @ApiProperty({ example: 5, description: '구매확정 (PURCHASE_CONFIRMED)' })
  declare purchaseConfirmed: number;
  @ApiProperty({
    example: 3,
    description: '정산요청/완료 (SETTLEMENT_REQUESTED + SETTLEMENT_COMPLETED)',
  })
  declare settlement: number;
  @ApiProperty({ example: 1, description: '기한만료 (EXPIRED)' })
  declare expired: number;
  @ApiProperty({ example: 1, description: '마감임박 (DEADLINE_IMMINENT)' })
  declare deadlineImminent: number;
  @ApiProperty({
    example: 1,
    description:
      '환불·취소 (CANCEL_REQUESTED + PAYMENT_CANCELLED + REFUND_REQUESTED + REFUND_COMPLETED)',
  })
  declare cancelRefund: number;
}
