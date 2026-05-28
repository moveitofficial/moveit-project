import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  OrderStatus,
  PaymentStatus,
  RefundStatus,
  RefundType,
} from '@prisma/client';

class OrderServiceImageDto {
  @ApiProperty({ example: 'https://cdn.example.com/main.jpg' })
  declare imgUrl: string;
}

class OrderServiceSummaryDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ example: '웹 서비스 MVP 개발' })
  declare title: string;

  @ApiProperty({ example: 380_000 })
  declare servicePrice: number;

  @ApiProperty({ type: [OrderServiceImageDto] })
  declare images: OrderServiceImageDto[];
}

class OrderClientSummaryDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ nullable: true, example: '조한준' })
  declare name: string | null;
}

class OrderExpertSummaryDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ nullable: true, example: '홍길동' })
  declare name: string | null;

  @ApiProperty({
    nullable: true,
    example: 'https://cdn.example.com/profile.jpg',
  })
  declare profileImageUrl: string | null;
}

class OrderListPaginationDto {
  @ApiProperty({ example: 1 })
  declare page: number;

  @ApiProperty({ example: 20 })
  declare pageSize: number;

  @ApiProperty({ example: 50 })
  declare totalCount: number;

  @ApiProperty({ example: true })
  declare hasNext: boolean;
}

export class OrderListItemDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ enum: OrderStatus, example: OrderStatus.IN_PROGRESS })
  declare status: OrderStatus;

  @ApiProperty({ example: 418_000 })
  declare totalAmount: number;

  @ApiProperty({ example: 380_000 })
  declare agreedServicePrice: number;

  @ApiProperty({ example: 38_000 })
  declare platformFee: number;

  @ApiProperty({ example: '2026-06-01T00:00:00.000Z' })
  declare startDate: Date;

  @ApiProperty({ example: '2026-06-30T00:00:00.000Z' })
  declare endDate: Date;

  @ApiProperty()
  declare createdAt: Date;

  @ApiProperty({ type: OrderServiceSummaryDto })
  declare service: OrderServiceSummaryDto;

  @ApiProperty({ type: OrderClientSummaryDto })
  declare clientUser: OrderClientSummaryDto;

  @ApiProperty({ type: OrderExpertSummaryDto })
  declare expertUser: OrderExpertSummaryDto;
}

export class OrderListResponseDto {
  @ApiProperty({ type: [OrderListItemDto] })
  declare items: OrderListItemDto[];

  @ApiProperty({ type: OrderListPaginationDto })
  declare pagination: OrderListPaginationDto;
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

  @ApiProperty({ nullable: true })
  declare adminReason: string | null;

  @ApiProperty()
  declare requestedAt: Date;

  @ApiPropertyOptional({ nullable: true })
  declare approvedAt: Date | null;

  @ApiPropertyOptional({ nullable: true })
  declare refundedAt: Date | null;
}

class OrderPaymentDto {
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

  @ApiProperty({ nullable: true, example: 'tgen_20260527_example' })
  declare paymentKey: string | null;

  @ApiProperty()
  declare createdAt: Date;

  @ApiProperty({ nullable: true })
  declare approvedAt: Date | null;

  @ApiProperty({ type: OrderRefundDto, nullable: true })
  declare refund: OrderRefundDto | null;
}

class OrderDetailServiceDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ example: '웹 서비스 MVP 개발' })
  declare title: string;

  @ApiProperty({ example: 380_000 })
  declare servicePrice: number;

  @ApiProperty({ example: 30 })
  declare workDuration: number;

  @ApiProperty({ example: 3 })
  declare revisionCount: number;

  @ApiProperty({ example: '랜딩페이지 1종 제작' })
  declare serviceScope: string;

  @ApiProperty()
  declare description: string;

  @ApiProperty()
  declare preparationNotes: string;

  @ApiProperty()
  declare refundPolicy: string;
}

export class OrderDetailDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ enum: OrderStatus })
  declare status: OrderStatus;

  @ApiProperty({ example: 418_000 })
  declare totalAmount: number;

  @ApiProperty({ example: 380_000 })
  declare agreedServicePrice: number;

  @ApiProperty({ example: 38_000 })
  declare platformFee: number;

  @ApiProperty({ nullable: true })
  declare refundReason: string | null;

  @ApiProperty({ example: '2026-06-01T00:00:00.000Z' })
  declare startDate: Date;

  @ApiProperty({ example: '2026-06-30T00:00:00.000Z' })
  declare endDate: Date;

  @ApiProperty()
  declare createdAt: Date;

  @ApiProperty({ nullable: true })
  declare confirmedAt: Date | null;

  @ApiProperty({ nullable: true })
  declare settledAt: Date | null;

  @ApiProperty({ type: OrderDetailServiceDto })
  declare service: OrderDetailServiceDto;

  @ApiProperty({ type: OrderPaymentDto, nullable: true })
  declare payment: OrderPaymentDto | null;
}
