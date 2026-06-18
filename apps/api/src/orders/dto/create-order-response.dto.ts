import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus, PaymentStatus } from '@prisma/client';

class CreatedPaymentCardDto {
  @ApiProperty({
    example: '55703144****0044',
    description: '마스킹된 카드번호',
  })
  declare number: string;

  @ApiProperty({ example: '신용', description: '카드 종류' })
  declare cardType: string;

  @ApiProperty({ example: '61', description: '카드사 코드 (Toss 정의)' })
  declare issuerCode: string;

  @ApiProperty({ example: '00000000', description: '카드사 승인번호' })
  declare approveNo: string;
}

class CreatedOrderPaymentDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ enum: PaymentStatus, example: PaymentStatus.PAID })
  declare status: PaymentStatus;

  @ApiProperty({ example: 'CARD' })
  declare method: string;

  @ApiProperty({ example: 1_100_000 })
  declare paidAmount: number;

  @ApiProperty({ example: 1, description: '1 = 일시불, 2 이상 = 할부 개월 수' })
  declare installmentMonths: number;

  @ApiProperty({ example: 'tgen_20260604153000' })
  declare paymentKey: string;

  @ApiProperty()
  declare createdAt: Date;

  @ApiProperty()
  declare approvedAt: Date;

  @ApiPropertyOptional({
    type: CreatedPaymentCardDto,
    nullable: true,
    description: '카드 결제 정보 (비카드 결제 시 null)',
  })
  declare card: CreatedPaymentCardDto | null;

  @ApiPropertyOptional({
    nullable: true,
    example: 'https://dashboard.tosspayments.com/receipt/...',
    description: '영수증 URL',
  })
  declare receiptUrl: string | null;
}

export class CreateOrderResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ enum: OrderStatus, example: OrderStatus.NEGOTIATING })
  declare status: OrderStatus;

  @ApiProperty({ example: 1_000_000 })
  declare agreedServicePrice: number;

  @ApiProperty({ example: 100_000 })
  declare platformFee: number;

  @ApiProperty({ example: 1_100_000 })
  declare totalAmount: number;

  @ApiProperty({ example: '2026-06-01T00:00:00.000Z' })
  declare startDate: Date;

  @ApiPropertyOptional({
    nullable: true,
    example: null,
    description: '전문가 일정 등록 전 null',
  })
  declare endDate: Date | null;

  @ApiProperty()
  declare createdAt: Date;

  @ApiProperty({ type: CreatedOrderPaymentDto })
  declare payment: CreatedOrderPaymentDto;
}
