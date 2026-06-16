import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  OrderStatus,
  PaymentStatus,
  RefundStatus,
  RefundType,
} from '@prisma/client';

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

class OrderPaymentBaseDto {
  @ApiProperty({ enum: OrderStatus, description: '주문 상태' })
  declare orderStatus: OrderStatus;

  @ApiProperty({ format: 'uuid' })
  declare paymentId: string;

  @ApiProperty({ enum: PaymentStatus })
  declare paymentStatus: PaymentStatus;

  @ApiProperty({ example: 'CARD', description: '결제 수단' })
  declare method: string;

  @ApiProperty({
    example: 1,
    description: '결제 방식. 1 = 일시불, 2 이상 = 할부 개월 수',
  })
  declare installmentMonths: number;

  @ApiPropertyOptional({ nullable: true, example: 'tgen_20260527_example' })
  declare paymentKey: string | null;

  @ApiPropertyOptional({ nullable: true, description: '결제 일시' })
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
  })
  declare receiptUrl: string | null;

  @ApiPropertyOptional({ type: OrderRefundDto, nullable: true })
  declare refund: OrderRefundDto | null;
}

export class ClientOrderPaymentDto extends OrderPaymentBaseDto {
  @ApiProperty({ example: 7_700_000, description: '합의된 서비스 금액' })
  declare agreedServicePrice: number;

  @ApiProperty({ example: 770_000, description: '무빗 플랫폼 수수료' })
  declare platformFee: number;

  @ApiPropertyOptional({
    nullable: true,
    example: 8_470_000,
    description: '최종 결제금액. 취소·환불 완료 시 null',
  })
  declare totalAmount: number | null;

  @ApiPropertyOptional({
    nullable: true,
    example: 8_470_000,
    description: '취소·환불 완료 시 환불금액. 그 외 null',
  })
  declare refundAmount: number | null;
}

export class ExpertOrderPaymentDto extends OrderPaymentBaseDto {
  @ApiPropertyOptional({
    nullable: true,
    example: 7_700_000,
    description: '합의된 서비스 금액. 취소·환불 완료 시 null',
  })
  declare agreedServicePrice: number | null;

  @ApiPropertyOptional({
    nullable: true,
    example: 7_700_000,
    description: '정산 예정/완료 금액. 취소·환불 완료 시 null',
  })
  declare settlementAmount: number | null;

  @ApiPropertyOptional({
    nullable: true,
    example: 7_700_000,
    description: '취소·환불 완료 시 환불금액 (수수료 제외). 그 외 null',
  })
  declare refundAmount: number | null;
}
