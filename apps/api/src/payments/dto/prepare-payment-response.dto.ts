import { ApiProperty } from '@nestjs/swagger';

export class PreparePaymentResponseDto {
  @ApiProperty({ format: 'uuid', description: '주문 ID (Toss orderId와 동일)' })
  declare orderId: string;

  @ApiProperty({
    example: 1_100_000,
    description: '결제 금액 (서버 주문 기준)',
  })
  declare amount: number;

  @ApiProperty({ example: '웹 개발 코칭', description: '결제창 표시 주문명' })
  declare orderName: string;

  @ApiProperty({
    example: 'test_ck_...',
    description: 'Toss 결제 위젯 초기화용 클라이언트 키',
  })
  declare clientKey: string;

  @ApiProperty({ format: 'uuid', description: '고객 식별 키 (users.id)' })
  declare customerKey: string;

  @ApiProperty({ format: 'uuid', description: 'PENDING 결제 행 ID' })
  declare paymentId: string;

  @ApiProperty({ example: 'CARD', description: '결제 수단 (위젯 옵션)' })
  declare method: string;

  @ApiProperty({
    example: 1,
    description: '할부 개월 수 (1 = 일시불, 위젯 옵션)',
  })
  declare installmentMonths: number;
}
