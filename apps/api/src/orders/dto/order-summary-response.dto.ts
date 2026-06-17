import { ApiProperty } from '@nestjs/swagger';

export class ClientOrderSummaryDto {
  @ApiProperty({ example: 3, description: '작업중 (IN_PROGRESS)' })
  declare inProgress: number;

  @ApiProperty({ example: 2, description: '구매확정 대기 (WORK_COMPLETED)' })
  declare purchaseConfirmPending: number;

  @ApiProperty({
    example: 6,
    description:
      '리뷰 작성 가능 (PURCHASE_CONFIRMED + SETTLEMENT_REQUESTED + SETTLEMENT_COMPLETED)',
  })
  declare reviewable: number;

  @ApiProperty({
    example: 1,
    description: '환불요청·완료 (REFUND_REQUESTED + REFUND_COMPLETED)',
  })
  declare refund: number;
}

export class ExpertOrderSummaryDto {
  @ApiProperty({ example: 3, description: '신규주문 (NEGOTIATING)' })
  declare newOrder: number;

  @ApiProperty({ example: 2, description: '작업중 (IN_PROGRESS)' })
  declare inProgress: number;

  @ApiProperty({ example: 6, description: '마감임박 (DEADLINE_IMMINENT)' })
  declare deadlineImminent: number;

  @ApiProperty({ example: 1, description: '구매확정 대기 (WORK_COMPLETED)' })
  declare purchaseConfirmPending: number;
}
