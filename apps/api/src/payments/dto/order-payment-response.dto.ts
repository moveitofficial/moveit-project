import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentStatus, RefundStatus, RefundType } from '@prisma/client';

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

  @ApiPropertyOptional({ type: OrderRefundDto, nullable: true })
  declare refund: OrderRefundDto | null;
}
