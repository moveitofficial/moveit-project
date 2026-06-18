import { ApiProperty } from '@nestjs/swagger';
import { RefundType } from '@prisma/client';

export const APPROVER_TYPES = ['ADMIN', 'EXPERT'] as const;
export type ApproverType = (typeof APPROVER_TYPES)[number];

class OrderRefundApproverDto {
  @ApiProperty({ enum: APPROVER_TYPES, example: 'ADMIN' })
  declare type: ApproverType;

  @ApiProperty({ type: String, nullable: true, example: '코드잇 관리자' })
  declare name: string | null;

  @ApiProperty({
    type: String,
    nullable: true,
    example: '업체 일정 만료로 인해 전액환불',
    description: '관리자 승인일 때만 값. 판매자 승인이면 null.',
  })
  declare reason: string | null;
}

export class OrderRefundResponseDto {
  // 결제 정보
  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2025-10-14T07:49:00.000Z',
    description: '결제 일시',
  })
  declare paidAt: Date;

  @ApiProperty({ example: '신용카드 롯데' })
  declare method: string;

  @ApiProperty({ example: 1, description: '1=일시불, 2+=할부 N개월' })
  declare installmentMonths: number;

  // 금액
  @ApiProperty({ example: 7_700_000, description: '서비스 금액' })
  declare servicePrice: number;

  @ApiProperty({ example: 770_000, description: '무빗 수수료' })
  declare platformFee: number;

  @ApiProperty({ example: 8_470_000, description: '취소·환불 금액' })
  declare refundAmount: number;

  // 취소·환불 메타
  @ApiProperty({ enum: RefundType, example: RefundType.CANCEL })
  declare type: RefundType;

  @ApiProperty({
    type: String,
    format: 'date-time',
    nullable: true,
    example: '2025-04-30T00:00:00.000Z',
    description: '취소·환불 완료일. 승인 전(REQUESTED)이면 null.',
  })
  declare approvedAt: Date | null;

  // 승인자
  @ApiProperty({
    type: OrderRefundApproverDto,
    nullable: true,
    description: '승인 완료된 경우에만 값. 승인 전(REQUESTED)이면 null.',
  })
  declare approvedBy: OrderRefundApproverDto | null;
}
