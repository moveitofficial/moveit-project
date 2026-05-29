import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, IsUUID, Min } from 'class-validator';

export class CreateOrderRequestDto {
  @ApiProperty({
    description: '구매할 서비스 UUID',
    example: 'd3b07384-d113-4956-a5cc-48419dd81f8c',
  })
  @IsUUID()
  declare serviceId: string;

  @ApiProperty({
    description: 'PG사 발급 결제 고유 키',
    example: 'tgen_20260527_example',
  })
  @IsString()
  @IsNotEmpty()
  declare paymentKey: string;

  @ApiProperty({
    description: '클라이언트가 최종 결제 완료한 금액(원)',
    example: 1_100_000,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  declare paidAmount: number;
}
