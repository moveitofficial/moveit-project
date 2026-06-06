import { ApiProperty } from '@nestjs/swagger';

export class OrderTransactionResponseDto {
  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2025-10-14T07:49:00.000Z',
    description: '결제 일시 (Payment.approvedAt)',
  })
  declare paidAt: Date;

  @ApiProperty({ example: '신용카드 롯데', description: '결제 수단' })
  declare method: string;

  @ApiProperty({
    example: 1,
    description: '1 = 일시불, 2 이상 = 할부 개월 수',
  })
  declare installmentMonths: number;

  @ApiProperty({ example: 7_700_000, description: '서비스 금액' })
  declare servicePrice: number;

  @ApiProperty({ example: 770_000, description: '무빗 수수료 (플랫폼 수수료)' })
  declare platformFee: number;

  @ApiProperty({ example: 8_470_000, description: '최종 결제금액' })
  declare totalAmount: number;
}
