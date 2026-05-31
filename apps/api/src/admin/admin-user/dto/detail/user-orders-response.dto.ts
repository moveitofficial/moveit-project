import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';

// RefundType_RefundStatus 합친 단일 키. 프론트는 매핑 객체 하나로 라벨 변환.
export const REFUND_KIND_VALUES = [
  'CANCEL_REQUESTED',
  'CANCEL_APPROVED',
  'CANCEL_REJECTED',
  'CANCEL_COMPLETED',
  'REFUND_REQUESTED',
  'REFUND_APPROVED',
  'REFUND_REJECTED',
  'REFUND_COMPLETED',
] as const;
export type RefundKind = (typeof REFUND_KIND_VALUES)[number];

class OrderServiceRefDto {
  @ApiProperty({
    format: 'uuid',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  declare id: string;

  @ApiProperty({ example: '안드로이드 / iOS 앱 개발 React Native' })
  declare title: string;
}

class OrderExpertRefDto {
  @ApiProperty({
    format: 'uuid',
    example: '8a1f9c2d-7e3b-4a5c-9d6e-1f2a3b4c5d6e',
  })
  declare id: string;

  @ApiProperty({ type: String, nullable: true, example: 'DevLydia' })
  declare name: string | null;
}

// 구매내역(CLIENT 전용). 상태/취소·환불 컬럼은 OrderStatus 한 enum이라 프론트에서 분류.
export class UserOrderItemDto {
  @ApiProperty({
    format: 'uuid',
    description: '주문 id',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  declare id: string;

  @ApiProperty({ type: OrderServiceRefDto })
  declare service: OrderServiceRefDto;

  @ApiProperty({ type: OrderExpertRefDto })
  declare expert: OrderExpertRefDto;

  @ApiProperty({ enum: OrderStatus, example: OrderStatus.IN_PROGRESS })
  declare status: OrderStatus;

  @ApiProperty({ example: 1_100_000, description: '결제 금액(수수료 포함)' })
  declare totalAmount: number;

  @ApiProperty({ example: 100_000, description: '플랫폼 수수료' })
  declare platformFee: number;

  @ApiProperty({
    type: String,
    format: 'date-time',
    nullable: true,
    description: '작업 마감일',
    example: '2025-06-08T00:00:00.000Z',
  })
  declare endDate: Date | null;

  @ApiPropertyOptional({
    enum: REFUND_KIND_VALUES,
    nullable: true,
    description:
      '취소·환불 상태 (RefundType_RefundStatus). 없으면 null = 디자인의 "-"',
    example: 'REFUND_REQUESTED',
  })
  declare refund: RefundKind | null;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2025-05-08T00:00:00.000Z',
  })
  declare createdAt: Date;
}
