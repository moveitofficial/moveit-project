import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class ConfirmPaymentRequestDto {
  @ApiProperty({
    description: 'PG사 발급 결제 고유 키',
    example: 'tgen_20260604153000',
  })
  @IsString()
  @IsNotEmpty()
  declare paymentKey: string;

  @ApiProperty({
    description:
      '결제 승인 요청 금액(원). 주문 totalAmount와 일치해야 합니다.',
    example: 1_100_000,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  declare amount: number;
}
