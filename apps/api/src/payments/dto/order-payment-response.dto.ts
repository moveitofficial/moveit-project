import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentStatus, RefundStatus, RefundType } from '@prisma/client';

class PaymentCardDto {
  @ApiProperty({
    example: '55703144****0044',
    description: '마스킹된 카드번호',
  })
  declare number: string;

  @ApiProperty({ example: '신용', description: '카드 종류 (신용/체크 등)' })
  declare cardType: string;

  @ApiProperty({ example: '61', description: '카드사 코드 (Toss 정의)' })
  declare issuerCode: string;

  @ApiProperty({ example: '00000000', description: '카드사 승인번호' })
  declare approveNo: string;
}

class OrderRefundDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ enum: RefundType })
  declare type: RefundType;

  @ApiProperty({ enum: RefundStatus })
  declare status: RefundStatus;

  @ApiProperty({ example: 380_000 })
  declare refundAmount: number;

  @ApiPropertyOptional({ nullable: true })
  declare adminReason: string | null;

  @ApiProperty()
  declare requestedAt: Date;

  @ApiPropertyOptional({ nullable: true })
  declare approvedAt: Date | null;

  @ApiPropertyOptional({ nullable: true })
  declare refundedAt: Date | null;
}

export class OrderPaymentDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ enum: PaymentStatus })
  declare status: PaymentStatus;

  @ApiProperty({ example: 'CARD' })
  declare method: string;

  @ApiProperty({ example: 418_000 })
  declare paidAmount: number;

  @ApiProperty({ example: 1, description: '1 = 일시불, 2 이상 = 할부 개월 수' })
  declare installmentMonths: number;

  @ApiPropertyOptional({ nullable: true, example: 'tgen_20260527_example' })
  declare paymentKey: string | null;

  @ApiProperty()
  declare createdAt: Date;

  @ApiPropertyOptional({ nullable: true })
  declare approvedAt: Date | null;

  @ApiPropertyOptional({
    type: PaymentCardDto,
    nullable: true,
    description: '카드 결제 정보 (비카드 결제 시 null)',
  })
  declare card: PaymentCardDto | null;

  @ApiPropertyOptional({
    nullable: true,
    example: 'https://dashboard.tosspayments.com/receipt/...',
    description: '영수증 URL',
  })
  declare receiptUrl: string | null;

  @ApiPropertyOptional({ type: OrderRefundDto, nullable: true })
  declare refund: OrderRefundDto | null;
}
