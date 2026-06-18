import { ApiProperty } from '@nestjs/swagger';

export class OrderSettlementPreviewResponseDto {
  @ApiProperty({
    type: String,
    nullable: true,
    example: '(주)디자인커넥트랩',
    description: '판매자 회사명 (사업자 미등록 시 null)',
  })
  declare businessName: string | null;

  @ApiProperty({
    type: String,
    nullable: true,
    example: '기업은행',
    description: '판매자 등록 은행명',
  })
  declare bankName: string | null;

  @ApiProperty({
    type: String,
    nullable: true,
    example: '0000000000',
    description: '판매자 등록 계좌번호',
  })
  declare bankAccount: string | null;

  @ApiProperty({
    example: 80_000_000,
    description:
      '관리자가 판매자에게 입금해야 하는 금액 (= agreedServicePrice, 플랫폼 수수료 제외)',
  })
  declare settlementAmount: number;
}
