import { ApiProperty } from '@nestjs/swagger';

export class OrderSettlementResponseDto {
  // ───── 결제 정보 ─────
  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2025-10-14T16:49:00.000Z',
    description: '결제 일시 (Payment.approvedAt)',
  })
  declare paidAt: Date;

  @ApiProperty({ example: '신용카드 롯데', description: '결제 수단' })
  declare method: string;

  @ApiProperty({
    example: 1,
    description: '결제 방식 — 1이면 일시불, 2 이상이면 할부 개월 수',
  })
  declare installmentMonths: number;

  // ───── 금액 ─────
  @ApiProperty({
    example: 7_700_000,
    description: '서비스 금액 (= 판매자가 받기로 한 금액, agreedServicePrice)',
  })
  declare servicePrice: number;

  @ApiProperty({
    example: 770_000,
    description: '무빗 수수료 (Order.platformFee, 표시용)',
  })
  declare platformFee: number;

  @ApiProperty({
    example: 7_700_000,
    description: '최종 정산금액 (= servicePrice, 판매자 수령액)',
  })
  declare settlementAmount: number;

  // ───── 정산 담당자 ─────
  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2025-04-30T10:00:00.000Z',
    description: '정산 완료일 (Order.settledAt)',
  })
  declare settledAt: Date;

  @ApiProperty({
    type: String,
    nullable: true,
    example: '코드잇 관리자',
    description: '정산 처리한 관리자 이름 (관리자 삭제 시 null)',
  })
  declare settledByAdminName: string | null;
}
